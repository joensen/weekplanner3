/**
 * Stick Figure Fun - Many surprises for kids!
 * Little stick figures doing all sorts of fun things
 */
class StickFigureWalker {
  constructor() {
    this.isAnimating = false;
    this.minInterval = 3 * 60 * 1000;  // Minimum 3 minutes between appearances
    this.maxInterval = 10 * 60 * 1000; // Maximum 10 minutes between appearances

    this.animations = [
      'walking',
      'running',
      'jumping',
      'rolling',
      'crawling',
      'cleaning',
      'pushingBox',
      'shooting',
      'flying',
      'driving',
      'beingChased',
      'conga',
      'skateboarding',
      'dancing',
      'ninja'
    ];

    this.testIndex = 0;

    this.createStyles();
    this.scheduleNextAnimation();

    // First surprise after 10-30 seconds
    setTimeout(() => this.animate(), 10000 + Math.random() * 20000);

    // Press 'T' to test/cycle through animations
    document.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') {
        this.testNextAnimation();
      }
    });
  }

  testNextAnimation() {
    // Stop current animation if running
    const existing = document.querySelector('.stick-container');
    if (existing) existing.remove();
    this.isAnimating = false;

    // Get next animation in sequence
    const animation = this.animations[this.testIndex];
    console.log(`Testing animation ${this.testIndex + 1}/${this.animations.length}: ${animation}`);

    this.isAnimating = true;
    this[`create_${animation}`]();

    // Move to next animation
    this.testIndex = (this.testIndex + 1) % this.animations.length;
  }

  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .stick-container {
        position: fixed;
        bottom: 20px;
        z-index: 9999;
        pointer-events: none;
        display: flex;
        align-items: flex-end;
      }

      /* Base stick figure */
      .stick-person {
        position: relative;
        width: 40px;
        height: 80px;
        flex-shrink: 0;
      }

      .stick-person .head {
        width: 18px;
        height: 18px;
        border: 3px solid var(--stick-color);
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .stick-person .body {
        width: 3px;
        height: 28px;
        background: var(--stick-color);
        position: absolute;
        top: 21px;
        left: 50%;
        transform: translateX(-50%);
      }

      .stick-person .arm-left,
      .stick-person .arm-right {
        width: 3px;
        height: 22px;
        background: var(--stick-color);
        position: absolute;
        top: 24px;
        transform-origin: top center;
      }

      .stick-person .arm-left { left: calc(50% - 3px); }
      .stick-person .arm-right { left: calc(50%); }

      .stick-person .leg-left,
      .stick-person .leg-right {
        width: 3px;
        height: 28px;
        background: var(--stick-color);
        position: absolute;
        top: 48px;
        transform-origin: top center;
      }

      .stick-person .leg-left { left: calc(50% - 6px); }
      .stick-person .leg-right { left: calc(50% + 3px); }

      /* Props */
      .prop {
        position: absolute;
        background: var(--stick-color);
      }

      .broom {
        width: 4px;
        height: 50px;
        background: #8B4513;
        position: absolute;
      }
      .broom::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -8px;
        width: 20px;
        height: 15px;
        background: #DAA520;
        border-radius: 0 0 5px 5px;
      }

      .box {
        width: 40px;
        height: 40px;
        border: 3px solid var(--stick-color);
        background: var(--stick-box-bg);
        margin-right: -10px;
      }

      .gun {
        width: 25px;
        height: 8px;
        background: var(--stick-color);
        position: absolute;
      }

      .bullet {
        width: 8px;
        height: 4px;
        background: #ffeb3b;
        border-radius: 2px;
        position: absolute;
        animation: bulletFly 0.5s linear infinite;
      }

      .jetpack {
        width: 20px;
        height: 25px;
        background: #666;
        border-radius: 5px;
        position: absolute;
      }
      .jetpack::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 2px;
        width: 16px;
        height: 20px;
        background: linear-gradient(to bottom, #ff6b35, #ff0);
        border-radius: 50%;
        animation: flame 0.1s infinite alternate;
      }

      .car {
        width: 80px;
        height: 35px;
        background: #e74c3c;
        border-radius: 10px 10px 5px 5px;
        position: relative;
      }
      .car::before {
        content: '';
        position: absolute;
        top: -15px;
        left: 15px;
        width: 45px;
        height: 18px;
        background: #c0392b;
        border-radius: 8px 8px 0 0;
      }
      .car .wheel {
        width: 18px;
        height: 18px;
        background: #333;
        border: 3px solid #666;
        border-radius: 50%;
        position: absolute;
        bottom: -8px;
        animation: wheelSpin 0.2s linear infinite;
      }
      .car .wheel-front { left: 10px; }
      .car .wheel-back { right: 10px; }

      .skateboard {
        width: 45px;
        height: 8px;
        background: #8B4513;
        border-radius: 10px;
        position: absolute;
        bottom: 0;
      }
      .skateboard::before, .skateboard::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: #333;
        border-radius: 50%;
        bottom: -5px;
      }
      .skateboard::before { left: 5px; }
      .skateboard::after { right: 5px; }

      /* Movement animations */
      .move-right {
        animation: moveRight 10s linear forwards;
      }
      .move-left {
        animation: moveLeft 10s linear forwards;
      }
      .move-right-fast {
        animation: moveRight 6s linear forwards;
      }
      .move-right-slow {
        animation: moveRight 14s linear forwards;
      }
      .move-fly {
        animation: moveFly 8s ease-in-out forwards;
      }

      @keyframes moveRight {
        from { left: -100px; }
        to { left: 110%; }
      }
      @keyframes moveLeft {
        from { right: -100px; }
        to { right: 110%; }
      }
      @keyframes moveFly {
        0% { left: -100px; bottom: 20px; }
        30% { bottom: 400px; }
        70% { bottom: 300px; }
        100% { left: 110%; bottom: 200px; }
      }

      /* Walking */
      .anim-walk .leg-left { animation: walkLeg 0.4s ease-in-out infinite; }
      .anim-walk .leg-right { animation: walkLeg 0.4s ease-in-out infinite reverse; }
      .anim-walk .arm-left { animation: walkArm 0.4s ease-in-out infinite; }
      .anim-walk .arm-right { animation: walkArm 0.4s ease-in-out infinite reverse; }

      /* Running */
      .anim-run .leg-left { animation: runLeg 0.2s ease-in-out infinite; }
      .anim-run .leg-right { animation: runLeg 0.2s ease-in-out infinite reverse; }
      .anim-run .arm-left { animation: runArm 0.2s ease-in-out infinite; }
      .anim-run .arm-right { animation: runArm 0.2s ease-in-out infinite reverse; }
      .anim-run .body { transform: translateX(-50%) rotate(15deg); }

      /* Jumping */
      .anim-jump {
        animation: jumpBounce 0.6s ease-in-out infinite;
      }
      .anim-jump .leg-left, .anim-jump .leg-right {
        animation: jumpLegs 0.6s ease-in-out infinite;
      }
      .anim-jump .arm-left, .anim-jump .arm-right {
        animation: jumpArms 0.6s ease-in-out infinite;
      }

      /* Rolling */
      .anim-roll {
        animation: roll 0.5s linear infinite;
      }
      .anim-roll .stick-person {
        transform: scale(0.8);
      }

      /* Crawling */
      .anim-crawl .stick-person {
        transform: rotate(70deg);
        transform-origin: bottom center;
      }
      .anim-crawl .leg-left { animation: crawlLeg 0.3s ease-in-out infinite; }
      .anim-crawl .leg-right { animation: crawlLeg 0.3s ease-in-out infinite reverse; }
      .anim-crawl .arm-left { animation: crawlArm 0.3s ease-in-out infinite; transform: rotate(-60deg); }
      .anim-crawl .arm-right { animation: crawlArm 0.3s ease-in-out infinite reverse; transform: rotate(-60deg); }

      /* Cleaning */
      .anim-clean .arm-right {
        animation: sweepArm 0.4s ease-in-out infinite;
        transform-origin: top center;
      }

      /* Pushing */
      .anim-push .body { transform: translateX(-50%) rotate(30deg); }
      .anim-push .arm-left, .anim-push .arm-right {
        transform: rotate(-60deg);
      }
      .anim-push .leg-left { animation: pushLeg 0.4s ease-in-out infinite; }
      .anim-push .leg-right { animation: pushLeg 0.4s ease-in-out infinite reverse; }

      /* Shooting */
      .anim-shoot .arm-right {
        transform: rotate(-90deg);
      }

      /* Flying */
      .anim-fly .arm-left, .anim-fly .arm-right {
        transform: rotate(-150deg);
      }
      .anim-fly .leg-left, .anim-fly .leg-right {
        transform: rotate(20deg);
      }

      /* Driving */
      .anim-drive {
        margin-bottom: 20px;
      }
      .anim-drive .arm-left, .anim-drive .arm-right {
        transform: rotate(-45deg);
      }
      .anim-drive .leg-left, .anim-drive .leg-right {
        transform: rotate(45deg);
      }

      /* Dancing */
      .anim-dance {
        animation: danceMove 0.4s ease-in-out infinite;
      }
      .anim-dance .arm-left { animation: danceArmL 0.4s ease-in-out infinite; }
      .anim-dance .arm-right { animation: danceArmR 0.4s ease-in-out infinite; }
      .anim-dance .leg-left { animation: danceLeg 0.2s ease-in-out infinite; }
      .anim-dance .leg-right { animation: danceLeg 0.2s ease-in-out infinite reverse; }

      /* Ninja */
      .anim-ninja .arm-left { transform: rotate(-120deg); }
      .anim-ninja .arm-right { transform: rotate(-60deg); }
      .anim-ninja .leg-left { animation: ninjaLeg 0.3s ease-in-out infinite; }
      .anim-ninja .leg-right { transform: rotate(30deg); }
      .ninja-sword {
        width: 35px;
        height: 4px;
        background: linear-gradient(to right, #888, var(--stick-color));
        position: absolute;
        top: 25px;
        left: 30px;
        transform: rotate(-30deg);
      }

      /* Skateboarding */
      .anim-skate .leg-left, .anim-skate .leg-right {
        transform: rotate(20deg);
      }
      .anim-skate .arm-left { transform: rotate(-30deg); }
      .anim-skate .arm-right { transform: rotate(30deg); }
      .anim-skate {
        animation: skateWobble 0.3s ease-in-out infinite;
      }

      /* Scared (being chased) */
      .anim-scared .arm-left, .anim-scared .arm-right {
        animation: scaredArms 0.15s ease-in-out infinite;
      }
      .anim-scared .leg-left { animation: runLeg 0.15s ease-in-out infinite; }
      .anim-scared .leg-right { animation: runLeg 0.15s ease-in-out infinite reverse; }

      /* Monster */
      .monster {
        width: 60px;
        height: 60px;
        position: relative;
      }
      .monster .body {
        width: 50px;
        height: 50px;
        background: #e74c3c;
        border-radius: 50% 50% 40% 40%;
        position: relative;
      }
      .monster .eye {
        width: 15px;
        height: 15px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        top: 10px;
      }
      .monster .eye::after {
        content: '';
        width: 8px;
        height: 8px;
        background: #000;
        border-radius: 50%;
        position: absolute;
        top: 3px;
        left: 3px;
      }
      .monster .eye-left { left: 8px; }
      .monster .eye-right { right: 8px; }
      .monster .mouth {
        width: 30px;
        height: 15px;
        background: #000;
        border-radius: 0 0 15px 15px;
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
      }
      .monster .leg {
        width: 8px;
        height: 20px;
        background: #c0392b;
        position: absolute;
        bottom: -15px;
        animation: monsterWalk 0.2s ease-in-out infinite;
      }
      .monster .leg-left { left: 10px; }
      .monster .leg-right { right: 10px; animation-delay: 0.1s; }

      @keyframes walkLeg {
        0%, 100% { transform: rotate(-25deg); }
        50% { transform: rotate(25deg); }
      }
      @keyframes walkArm {
        0%, 100% { transform: rotate(25deg); }
        50% { transform: rotate(-25deg); }
      }
      @keyframes runLeg {
        0%, 100% { transform: rotate(-45deg); }
        50% { transform: rotate(45deg); }
      }
      @keyframes runArm {
        0%, 100% { transform: rotate(60deg); }
        50% { transform: rotate(-60deg); }
      }
      @keyframes jumpBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-50px); }
      }
      @keyframes jumpLegs {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-30deg); }
      }
      @keyframes jumpArms {
        0%, 100% { transform: rotate(20deg); }
        50% { transform: rotate(-160deg); }
      }
      @keyframes roll {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes crawlLeg {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(20deg); }
      }
      @keyframes crawlArm {
        0%, 100% { transform: rotate(-80deg); }
        50% { transform: rotate(-40deg); }
      }
      @keyframes sweepArm {
        0%, 100% { transform: rotate(-30deg); }
        50% { transform: rotate(-60deg); }
      }
      @keyframes pushLeg {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(30deg); }
      }
      @keyframes flame {
        from { height: 20px; opacity: 1; }
        to { height: 25px; opacity: 0.8; }
      }
      @keyframes wheelSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes bulletFly {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
      }
      @keyframes danceMove {
        0%, 100% { transform: translateY(0) rotate(-5deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
      }
      @keyframes danceArmL {
        0%, 100% { transform: rotate(-140deg); }
        50% { transform: rotate(-160deg); }
      }
      @keyframes danceArmR {
        0%, 100% { transform: rotate(-160deg); }
        50% { transform: rotate(-140deg); }
      }
      @keyframes danceLeg {
        0%, 100% { transform: rotate(-15deg); }
        50% { transform: rotate(15deg); }
      }
      @keyframes ninjaLeg {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-90deg); }
      }
      @keyframes skateWobble {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes scaredArms {
        0%, 100% { transform: rotate(-130deg); }
        50% { transform: rotate(-150deg); }
      }
      @keyframes monsterWalk {
        0%, 100% { transform: rotate(-10deg); }
        50% { transform: rotate(10deg); }
      }
    `;
    document.head.appendChild(style);
  }

  createStickPerson() {
    const person = document.createElement('div');
    person.className = 'stick-person';
    person.innerHTML = `
      <div class="head"></div>
      <div class="body"></div>
      <div class="arm-left"></div>
      <div class="arm-right"></div>
      <div class="leg-left"></div>
      <div class="leg-right"></div>
    `;
    return person;
  }

  createMonster() {
    const monster = document.createElement('div');
    monster.className = 'monster';
    monster.innerHTML = `
      <div class="body">
        <div class="eye eye-left"></div>
        <div class="eye eye-right"></div>
        <div class="mouth"></div>
      </div>
      <div class="leg leg-left"></div>
      <div class="leg leg-right"></div>
    `;
    return monster;
  }

  animate() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const animation = this.animations[Math.floor(Math.random() * this.animations.length)];
    this[`create_${animation}`]();
  }

  cleanupAndSchedule(container, duration) {
    setTimeout(() => {
      container.remove();
      this.isAnimating = false;
      this.scheduleNextAnimation();
    }, duration);
  }

  create_walking() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-walk';
    wrapper.appendChild(this.createStickPerson());
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_running() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-run';
    wrapper.appendChild(this.createStickPerson());
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  create_jumping() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-jump';
    wrapper.appendChild(this.createStickPerson());
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_rolling() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-roll';
    wrapper.appendChild(this.createStickPerson());
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  create_crawling() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-slow';
    container.style.bottom = '5px';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-crawl';
    wrapper.appendChild(this.createStickPerson());
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 14500);
  }

  create_cleaning() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-slow';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-clean anim-walk';
    const person = this.createStickPerson();
    const broom = document.createElement('div');
    broom.className = 'broom';
    broom.style.cssText = 'left: 35px; top: 25px; transform: rotate(-30deg);';
    person.appendChild(broom);
    wrapper.appendChild(person);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 14500);
  }

  create_pushingBox() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-slow';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-push';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-end';
    wrapper.appendChild(this.createStickPerson());
    const box = document.createElement('div');
    box.className = 'box';
    wrapper.appendChild(box);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 14500);
  }

  create_shooting() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-shoot anim-walk';
    const person = this.createStickPerson();
    const gun = document.createElement('div');
    gun.className = 'gun';
    gun.style.cssText = 'left: 30px; top: 20px;';
    person.appendChild(gun);
    wrapper.appendChild(person);
    container.appendChild(wrapper);

    // Add bullets periodically
    const bulletInterval = setInterval(() => {
      const bullet = document.createElement('div');
      bullet.className = 'bullet';
      bullet.style.cssText = 'left: 55px; top: 22px;';
      person.appendChild(bullet);
      setTimeout(() => bullet.remove(), 500);
    }, 600);

    document.body.appendChild(container);
    setTimeout(() => clearInterval(bulletInterval), 10000);
    this.cleanupAndSchedule(container, 10500);
  }

  create_flying() {
    const container = document.createElement('div');
    container.className = 'stick-container move-fly';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-fly';
    const person = this.createStickPerson();
    const jetpack = document.createElement('div');
    jetpack.className = 'jetpack';
    jetpack.style.cssText = 'left: 5px; top: 22px;';
    person.appendChild(jetpack);
    wrapper.appendChild(person);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 8500);
  }

  create_driving() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    container.style.bottom = '10px';

    const car = document.createElement('div');
    car.className = 'car';
    car.innerHTML = '<div class="wheel wheel-front"></div><div class="wheel wheel-back"></div>';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-drive';
    wrapper.style.cssText = 'position: absolute; bottom: 30px; left: 25px; transform: scale(0.7);';
    wrapper.appendChild(this.createStickPerson());

    car.appendChild(wrapper);
    container.appendChild(car);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  create_beingChased() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    container.style.display = 'flex';
    container.style.gap = '30px';

    const runner = document.createElement('div');
    runner.className = 'anim-scared';
    runner.appendChild(this.createStickPerson());

    container.appendChild(this.createMonster());
    container.appendChild(runner);

    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  create_conga() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    container.style.display = 'flex';
    container.style.gap = '10px';

    // Create 5 dancing friends in a conga line
    for (let i = 0; i < 5; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'anim-dance';
      wrapper.style.animationDelay = `${i * 0.1}s`;
      wrapper.appendChild(this.createStickPerson());
      container.appendChild(wrapper);
    }

    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_skateboarding() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-skate';
    wrapper.style.position = 'relative';

    const person = this.createStickPerson();
    person.style.bottom = '8px';
    person.style.position = 'relative';
    wrapper.appendChild(person);

    const board = document.createElement('div');
    board.className = 'skateboard';
    wrapper.appendChild(board);

    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  create_dancing() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-slow';
    container.style.display = 'flex';
    container.style.gap = '20px';

    // Create 3 dancing friends
    for (let i = 0; i < 3; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'anim-dance';
      wrapper.style.animationDelay = `${i * 0.15}s`;
      wrapper.appendChild(this.createStickPerson());
      container.appendChild(wrapper);
    }

    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 14500);
  }

  create_ninja() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-ninja';
    const person = this.createStickPerson();

    const sword = document.createElement('div');
    sword.className = 'ninja-sword';
    person.appendChild(sword);

    wrapper.appendChild(person);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  scheduleNextAnimation() {
    const delay = this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
    setTimeout(() => this.animate(), delay);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new StickFigureWalker();
});
