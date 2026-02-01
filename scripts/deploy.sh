#!/bin/bash

# Weekplanner3 Deployment Script for Raspberry Pi
# Usage: ./deploy.sh [install|update|start|stop|restart|status|logs]

set -e

APP_NAME="weekplanner3"
APP_DIR="/home/pi/weekplanner3"
REPO_URL="https://github.com/joensen/weekplanner3.git"
NODE_VERSION="22"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_node() {
    if ! command -v node &> /dev/null; then
        log_warn "Node.js not found. Installing..."
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    log_info "Node.js version: $(node -v)"
}

install_app() {
    log_info "Installing $APP_NAME..."

    # Install system dependencies
    sudo apt-get update
    sudo apt-get install -y git

    # Check/install Node.js
    check_node

    # Clone repository
    if [ -d "$APP_DIR" ]; then
        log_warn "Directory $APP_DIR already exists. Use 'update' instead."
        exit 1
    fi

    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"

    # Install npm dependencies
    npm install --production

    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        log_warn "Created .env from example. Please edit with your API keys:"
        log_warn "  nano $APP_DIR/.env"
    fi

    # Install systemd service
    install_service

    log_info "Installation complete!"
    log_info "Next steps:"
    log_info "  1. Edit your .env file: nano $APP_DIR/.env"
    log_info "  2. Start the service: $0 start"
}

install_service() {
    log_info "Installing systemd service..."

    sudo tee /etc/systemd/system/${APP_NAME}.service > /dev/null <<EOF
[Unit]
Description=Weekplanner3 Family Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable ${APP_NAME}
    log_info "Service installed and enabled"
}

update_app() {
    log_info "Updating $APP_NAME..."

    if [ ! -d "$APP_DIR" ]; then
        log_error "App not installed. Run '$0 install' first."
        exit 1
    fi

    cd "$APP_DIR"

    # Stop service if running
    if systemctl is-active --quiet ${APP_NAME}; then
        log_info "Stopping service..."
        sudo systemctl stop ${APP_NAME}
    fi

    # Pull latest changes
    git pull origin master

    # Update dependencies
    npm install --production

    # Restart service
    log_info "Starting service..."
    sudo systemctl start ${APP_NAME}

    log_info "Update complete!"
}

start_app() {
    log_info "Starting $APP_NAME..."
    sudo systemctl start ${APP_NAME}
    sleep 2
    status_app
}

stop_app() {
    log_info "Stopping $APP_NAME..."
    sudo systemctl stop ${APP_NAME}
}

restart_app() {
    log_info "Restarting $APP_NAME..."
    sudo systemctl restart ${APP_NAME}
    sleep 2
    status_app
}

status_app() {
    echo ""
    sudo systemctl status ${APP_NAME} --no-pager || true
    echo ""

    # Show app URL
    IP=$(hostname -I | awk '{print $1}')
    if systemctl is-active --quiet ${APP_NAME}; then
        log_info "Dashboard available at: http://$IP:3000"
    fi
}

show_logs() {
    sudo journalctl -u ${APP_NAME} -f
}

show_help() {
    echo "Weekplanner3 Deployment Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install   - Fresh install (clone repo, install deps, setup service)"
    echo "  update    - Pull latest changes and restart"
    echo "  start     - Start the service"
    echo "  stop      - Stop the service"
    echo "  restart   - Restart the service"
    echo "  status    - Show service status"
    echo "  logs      - Follow service logs (Ctrl+C to exit)"
    echo "  help      - Show this help message"
}

# Main
case "${1:-help}" in
    install)  install_app ;;
    update)   update_app ;;
    start)    start_app ;;
    stop)     stop_app ;;
    restart)  restart_app ;;
    status)   status_app ;;
    logs)     show_logs ;;
    help|*)   show_help ;;
esac
