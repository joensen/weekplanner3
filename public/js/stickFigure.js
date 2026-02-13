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
      'ninja',
      'figure67',
      'cowboyOx',
      'coolGuy',
      'speaking',
      'airplane',
      'ufo',
      'shawarma',
      'darkFigure',
      'giant',
      'creeper',
      'rainbowBlue',
      'princessHorse',
      'mermaid',
      'footballKicker'
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

      /* === 67 Figure === */
      .figure67-head {
        font-size: 18px;
        font-weight: bold;
        color: var(--stick-color);
        position: absolute;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        font-family: monospace;
        line-height: 1;
      }
      .anim-figure67 .arm-left { animation: wave67Left 0.7s ease-in-out infinite; }
      .anim-figure67 .arm-right { animation: wave67Right 1.1s ease-in-out infinite; }
      .anim-figure67 .leg-left { animation: walkLeg 0.4s ease-in-out infinite; }
      .anim-figure67 .leg-right { animation: walkLeg 0.4s ease-in-out infinite reverse; }

      @keyframes wave67Left {
        0%, 100% { transform: rotate(20deg); }
        50% { transform: rotate(-170deg); }
      }
      @keyframes wave67Right {
        0%, 100% { transform: rotate(-170deg); }
        50% { transform: rotate(20deg); }
      }

      /* === Cowboy on Ox === */
      .ox {
        width: 110px;
        height: 70px;
        position: relative;
      }
      .ox .ox-body {
        width: 80px;
        height: 40px;
        background: #8B4513;
        border-radius: 25px 15px 10px 15px;
        position: absolute;
        bottom: 20px;
        left: 10px;
      }
      .ox .ox-head {
        width: 30px;
        height: 25px;
        background: #6B3410;
        border-radius: 8px 15px 5px 5px;
        position: absolute;
        bottom: 30px;
        right: -5px;
      }
      .ox .ox-horn {
        width: 3px;
        height: 15px;
        background: #DDD;
        position: absolute;
        top: -12px;
        transform-origin: bottom center;
      }
      .ox .ox-horn-left { left: 8px; transform: rotate(-20deg); }
      .ox .ox-horn-right { right: 8px; transform: rotate(20deg); }
      .ox .ox-leg {
        width: 6px;
        height: 22px;
        background: #6B3410;
        position: absolute;
        bottom: 0;
        transform-origin: top center;
      }
      .ox .ox-leg-1 { left: 15px; animation: oxWalk 0.4s ease-in-out infinite; }
      .ox .ox-leg-2 { left: 30px; animation: oxWalk 0.4s ease-in-out infinite reverse; }
      .ox .ox-leg-3 { right: 15px; animation: oxWalk 0.4s ease-in-out infinite; }
      .ox .ox-leg-4 { right: 0px; animation: oxWalk 0.4s ease-in-out infinite reverse; }
      .ox .ox-tail {
        width: 20px;
        height: 3px;
        background: #5B2D0E;
        position: absolute;
        bottom: 40px;
        left: -5px;
        transform-origin: right center;
        animation: tailSwing 0.6s ease-in-out infinite;
      }
      .cowboy-hat {
        width: 28px;
        height: 8px;
        background: #A0522D;
        border-radius: 50%;
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
      .cowboy-hat::before {
        content: '';
        width: 16px;
        height: 10px;
        background: #A0522D;
        border-radius: 5px 5px 0 0;
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
      }

      @keyframes oxWalk {
        0%, 100% { transform: rotate(-15deg); }
        50% { transform: rotate(15deg); }
      }
      @keyframes tailSwing {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(20deg); }
      }

      /* === Cool Guy === */
      .wavy-hair {
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 2px;
      }
      .wavy-hair .strand {
        width: 3px;
        height: 12px;
        background: var(--stick-color);
        border-radius: 2px;
        animation: hairWave 0.8s ease-in-out infinite;
      }
      .wavy-hair .strand:nth-child(2) { animation-delay: 0.1s; }
      .wavy-hair .strand:nth-child(3) { animation-delay: 0.2s; }
      .wavy-hair .strand:nth-child(4) { animation-delay: 0.3s; }
      .wavy-hair .strand:nth-child(5) { animation-delay: 0.4s; }
      .sunglasses {
        width: 20px;
        height: 6px;
        background: #333;
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 2px;
      }
      .anim-cool .arm-left { transform: rotate(-20deg); }
      .anim-cool .arm-right { transform: rotate(20deg); }
      .anim-cool .leg-left { animation: coolWalk 0.5s ease-in-out infinite; }
      .anim-cool .leg-right { animation: coolWalk 0.5s ease-in-out infinite reverse; }

      @keyframes hairWave {
        0%, 100% { transform: rotate(-15deg) scaleY(1); }
        50% { transform: rotate(15deg) scaleY(1.2); }
      }
      @keyframes coolWalk {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(20deg); }
      }

      /* === Speaking Figure === */
      .speech-bubble {
        position: absolute;
        top: -40px;
        left: 20px;
        background: white;
        color: #333;
        padding: 5px 12px;
        border-radius: 14px;
        font-size: 14px;
        font-weight: bold;
        font-family: sans-serif;
        white-space: nowrap;
        border: 2px solid var(--stick-color);
        animation: bubblePulse 1.5s ease-in-out infinite;
      }
      .speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 12px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid var(--stick-color);
      }

      @keyframes bubblePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
      }

      /* === Airplane === */
      .airplane {
        position: relative;
        width: 90px;
        height: 40px;
      }
      .airplane .fuselage {
        width: 75px;
        height: 16px;
        background: var(--stick-color);
        border-radius: 8px 50% 50% 8px;
        position: absolute;
        top: 12px;
        left: 5px;
      }
      .airplane .wing {
        width: 30px;
        height: 8px;
        background: var(--stick-color);
        position: absolute;
        top: 4px;
        left: 28px;
        transform: skewX(-10deg);
        border-radius: 2px;
        opacity: 0.85;
      }
      .airplane .tail-fin {
        width: 0;
        height: 0;
        border-right: 16px solid var(--stick-color);
        border-top: 14px solid transparent;
        border-bottom: 4px solid transparent;
        position: absolute;
        top: 2px;
        left: 2px;
      }
      .airplane .cockpit {
        width: 8px;
        height: 8px;
        background: #4fc3f7;
        border-radius: 50%;
        position: absolute;
        top: 14px;
        right: 8px;
      }
      .airplane .propeller {
        width: 4px;
        height: 22px;
        background: var(--stick-color);
        position: absolute;
        top: 4px;
        right: 0;
        transform-origin: center center;
        animation: propSpin 0.1s linear infinite;
      }
      .anim-airplane {
        animation: planeTilt 2s ease-in-out infinite;
      }
      .move-fly-plane {
        animation: moveFlyPlane 8s linear forwards;
      }

      @keyframes propSpin {
        from { transform: scaleY(1); }
        to { transform: scaleY(-1); }
      }
      @keyframes planeTilt {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes moveFlyPlane {
        0% { left: -150px; bottom: 250px; }
        25% { bottom: 450px; }
        50% { bottom: 350px; }
        75% { bottom: 420px; }
        100% { left: 110%; bottom: 380px; }
      }

      /* === UFO === */
      .ufo {
        position: relative;
        width: 70px;
        height: 50px;
      }
      .ufo .dome {
        width: 28px;
        height: 18px;
        background: rgba(100, 200, 255, 0.4);
        border-radius: 50% 50% 0 0;
        position: absolute;
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
        border: 2px solid rgba(100, 200, 255, 0.7);
        border-bottom: none;
      }
      .ufo .saucer {
        width: 70px;
        height: 14px;
        background: linear-gradient(to bottom, #999, #555);
        border-radius: 50%;
        position: absolute;
        top: 18px;
        left: 0;
      }
      .ufo .ufo-lights {
        position: absolute;
        top: 28px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
      }
      .ufo .ufo-light {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        animation: ufoLightBlink 0.5s ease-in-out infinite alternate;
      }
      .ufo .ufo-light:nth-child(1) { background: #ff0; }
      .ufo .ufo-light:nth-child(2) { background: #0f0; animation-delay: 0.15s; }
      .ufo .ufo-light:nth-child(3) { background: #f00; animation-delay: 0.3s; }
      .ufo .ufo-light:nth-child(4) { background: #ff0; animation-delay: 0.45s; }
      .ufo .beam {
        width: 40px;
        height: 80px;
        background: linear-gradient(to bottom, rgba(100, 255, 100, 0.3), transparent);
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
        animation: beamPulse 1s ease-in-out infinite;
      }
      .anim-ufo {
        animation: ufoHover 1s ease-in-out infinite;
      }
      .move-fly-ufo {
        animation: moveFlyUfo 10s linear forwards;
      }

      @keyframes ufoLightBlink {
        0% { opacity: 0.3; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1.3); }
      }
      @keyframes ufoHover {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-12px) rotate(2deg); }
      }
      @keyframes beamPulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      @keyframes moveFlyUfo {
        0% { left: -120px; bottom: 200px; }
        25% { bottom: 350px; }
        50% { bottom: 250px; }
        75% { bottom: 320px; }
        100% { left: 110%; bottom: 280px; }
      }

      /* === Shawarma with Legs === */
      .shawarma {
        position: relative;
        width: 35px;
        height: 75px;
      }
      .shawarma .wrap {
        width: 30px;
        height: 50px;
        background: linear-gradient(to right, #D2A86E, #C49555, #D2A86E);
        border-radius: 8px 8px 15px 15px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
      }
      .shawarma .filling {
        position: absolute;
        border-radius: 50%;
      }
      .shawarma .filling-1 { width: 8px; height: 5px; background: #4CAF50; top: 5px; left: 5px; }
      .shawarma .filling-2 { width: 6px; height: 6px; background: #f44336; top: 10px; right: 5px; }
      .shawarma .filling-3 { width: 7px; height: 4px; background: #FFF9C4; top: 18px; left: 8px; }
      .shawarma .filling-4 { width: 5px; height: 5px; background: #4CAF50; top: 14px; left: 3px; }
      .shawarma .filling-5 { width: 6px; height: 5px; background: #f44336; top: 24px; left: 10px; }
      .shawarma .filling-6 { width: 8px; height: 4px; background: #FFF9C4; top: 30px; left: 4px; }
      .shawarma .shawarma-eyes {
        position: absolute;
        top: 36px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
      }
      .shawarma .shawarma-eye {
        width: 5px;
        height: 5px;
        background: #333;
        border-radius: 50%;
      }
      .shawarma .shawarma-leg {
        width: 3px;
        height: 22px;
        background: var(--stick-color);
        position: absolute;
        top: 48px;
        transform-origin: top center;
      }
      .shawarma .shawarma-foot {
        width: 8px;
        height: 3px;
        background: var(--stick-color);
        position: absolute;
        bottom: -1px;
        left: -2px;
        border-radius: 2px;
      }
      .shawarma .shawarma-leg-left { left: 8px; animation: walkLeg 0.4s ease-in-out infinite; }
      .shawarma .shawarma-leg-right { right: 8px; animation: walkLeg 0.4s ease-in-out infinite reverse; }
      .anim-shawarma {
        animation: shawarmaWobble 0.3s ease-in-out infinite;
      }

      @keyframes shawarmaWobble {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }

      /* === Dark Figure (dark mode only) === */
      .dark-figure {
        position: relative;
        width: 40px;
        height: 90px;
      }
      .dark-figure .cloak {
        width: 36px;
        height: 70px;
        background: linear-gradient(to bottom, #1a1a2e, #0a0a15);
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        clip-path: polygon(25% 0%, 75% 0%, 95% 100%, 5% 100%);
      }
      .dark-figure .hood {
        width: 26px;
        height: 24px;
        background: #0d0d1a;
        border-radius: 50% 50% 35% 35%;
        position: absolute;
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
      }
      .dark-figure .dark-eyes {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
      }
      .dark-figure .dark-eye {
        width: 4px;
        height: 4px;
        background: #ff0000;
        border-radius: 50%;
        animation: eyeGlow 2s ease-in-out infinite;
        box-shadow: 0 0 6px #ff0000, 0 0 12px rgba(255, 0, 0, 0.4);
      }
      .dark-figure .dark-eye:nth-child(2) { animation-delay: 0.3s; }
      .dark-figure .dark-leg {
        width: 3px;
        height: 12px;
        background: #0a0a15;
        position: absolute;
        bottom: 0;
        transform-origin: top center;
      }
      .dark-figure .dark-leg-left { left: 13px; }
      .dark-figure .dark-leg-right { right: 13px; }
      .anim-dark .dark-figure {
        animation: darkFloat 2s ease-in-out infinite;
      }
      .anim-dark .dark-leg-left { animation: darkGlide 1.2s ease-in-out infinite; }
      .anim-dark .dark-leg-right { animation: darkGlide 1.2s ease-in-out infinite reverse; }
      .move-dark {
        animation: moveDark 14s linear forwards;
      }

      @keyframes eyeGlow {
        0%, 100% { opacity: 1; box-shadow: 0 0 6px #ff0000, 0 0 12px rgba(255, 0, 0, 0.4); }
        50% { opacity: 0.4; box-shadow: 0 0 3px #ff0000, 0 0 6px rgba(255, 0, 0, 0.2); }
      }
      @keyframes darkFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes darkGlide {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      @keyframes moveDark {
        0% { left: -100px; opacity: 0; }
        8% { opacity: 0.8; }
        92% { opacity: 0.8; }
        100% { left: 110%; opacity: 0; }
      }

      /* === Giant Figure (1/3 of screen) === */
      .anim-giant {
        transform: scale(8);
        transform-origin: bottom center;
      }
      .anim-giant .leg-left { animation: walkLeg 0.8s ease-in-out infinite; }
      .anim-giant .leg-right { animation: walkLeg 0.8s ease-in-out infinite reverse; }
      .anim-giant .arm-left { animation: walkArm 0.8s ease-in-out infinite; }
      .anim-giant .arm-right { animation: walkArm 0.8s ease-in-out infinite reverse; }
      .move-right-giant {
        animation: moveRightGiant 18s linear forwards;
      }

      @keyframes moveRightGiant {
        from { left: -400px; }
        to { left: 110%; }
      }

      /* === Creeper === */
      .creeper {
        position: relative;
        width: 40px;
        height: 68px;
      }
      .creeper .creeper-head {
        width: 30px;
        height: 30px;
        background: #4CAF50;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .creeper .creeper-eye {
        width: 7px;
        height: 7px;
        background: #1a1a1a;
        position: absolute;
        top: 6px;
      }
      .creeper .creeper-eye-left { left: 4px; }
      .creeper .creeper-eye-right { right: 4px; }
      .creeper .creeper-mouth-center {
        width: 4px;
        height: 8px;
        background: #1a1a1a;
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
      }
      .creeper .creeper-mouth-left {
        width: 4px;
        height: 5px;
        background: #1a1a1a;
        position: absolute;
        bottom: 7px;
        left: 8px;
      }
      .creeper .creeper-mouth-right {
        width: 4px;
        height: 5px;
        background: #1a1a1a;
        position: absolute;
        bottom: 7px;
        right: 8px;
      }
      .creeper .creeper-body {
        width: 20px;
        height: 18px;
        background: #4CAF50;
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
      .creeper .creeper-leg {
        width: 8px;
        height: 18px;
        background: #388E3C;
        position: absolute;
        bottom: 0;
        transform-origin: top center;
      }
      .creeper .creeper-leg-front { left: 8px; animation: creeperWalk 0.3s ease-in-out infinite; }
      .creeper .creeper-leg-back { right: 8px; animation: creeperWalk 0.3s ease-in-out infinite reverse; }
      .anim-creeper-flash {
        animation: creeperFlash 0.15s linear infinite !important;
      }
      .explosion-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 2px;
        animation: explodeParticle var(--explode-duration, 0.6s) ease-out forwards;
      }
      .explosion-flash {
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(255,255,0,0.9), rgba(255,100,0,0.5), transparent);
        border-radius: 50%;
        position: absolute;
        top: -10px;
        left: -10px;
        animation: flashBoom 0.5s ease-out forwards;
      }

      @keyframes creeperWalk {
        0%, 100% { transform: rotate(-15deg); }
        50% { transform: rotate(15deg); }
      }
      @keyframes creeperFlash {
        0%, 49% { filter: brightness(1); }
        50%, 100% { filter: brightness(3) saturate(0.5); }
      }
      @keyframes explodeParticle {
        0% { opacity: 1; transform: translate(0, 0) scale(1); }
        100% { opacity: 0; transform: translate(var(--ex, 50px), var(--ey, -50px)) scale(0.2); }
      }
      @keyframes flashBoom {
        0% { transform: scale(0.3); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }

      /* === Rainbow Friends Blue === */
      .rf-blue {
        position: relative;
        width: 60px;
        height: 85px;
      }
      .rf-blue .rf-head {
        width: 38px;
        height: 32px;
        background: #1976D2;
        border-radius: 50% 50% 40% 40%;
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
      }
      .rf-blue .rf-crown {
        width: 26px;
        height: 14px;
        background: #FFD700;
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        clip-path: polygon(0% 100%, 5% 40%, 25% 100%, 50% 0%, 75% 100%, 95% 40%, 100% 100%);
      }
      .rf-blue .rf-eye-right {
        width: 13px;
        height: 13px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 10px;
        right: 5px;
      }
      .rf-blue .rf-eye-right::after {
        content: '';
        width: 9px;
        height: 9px;
        background: #111;
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
      }
      .rf-blue .rf-eye-left {
        width: 13px;
        height: 13px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 10px;
        left: 5px;
        border: 1px solid #ddd;
      }
      .rf-blue .rf-button-h {
        width: 8px;
        height: 2px;
        background: #888;
        position: absolute;
        top: 5px;
        left: 2px;
      }
      .rf-blue .rf-button-v {
        width: 2px;
        height: 8px;
        background: #888;
        position: absolute;
        top: 2px;
        left: 5px;
      }
      .rf-blue .rf-drool {
        width: 4px;
        height: 14px;
        background: #64B5F6;
        position: absolute;
        top: 26px;
        right: 10px;
        border-radius: 0 0 3px 3px;
        animation: droolDrip 1s ease-in-out infinite;
      }
      .rf-blue .rf-drool::after {
        content: '';
        width: 6px;
        height: 6px;
        background: #64B5F6;
        border-radius: 50%;
        position: absolute;
        bottom: -3px;
        left: -1px;
      }
      .rf-blue .rf-body {
        width: 44px;
        height: 38px;
        background: #1565C0;
        border-radius: 10px;
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
      }
      .rf-blue .rf-arm {
        width: 10px;
        height: 32px;
        background: #1976D2;
        border-radius: 5px;
        position: absolute;
        top: 30px;
        transform-origin: top center;
      }
      .rf-blue .rf-arm-left { left: 0; animation: blueArmSwing 0.5s ease-in-out infinite; }
      .rf-blue .rf-arm-right { right: 0; animation: blueArmSwing 0.5s ease-in-out infinite reverse; }
      .rf-blue .rf-leg {
        width: 14px;
        height: 16px;
        background: #0D47A1;
        border-radius: 5px;
        position: absolute;
        bottom: 0;
        transform-origin: top center;
      }
      .rf-blue .rf-leg-left { left: 12px; animation: blueLegWalk 0.4s ease-in-out infinite; }
      .rf-blue .rf-leg-right { right: 12px; animation: blueLegWalk 0.4s ease-in-out infinite reverse; }
      .anim-rfblue {
        transform: rotate(8deg);
        transform-origin: bottom center;
      }

      @keyframes droolDrip {
        0%, 100% { height: 14px; }
        50% { height: 20px; }
      }
      @keyframes blueArmSwing {
        0%, 100% { transform: rotate(-10deg); }
        50% { transform: rotate(15deg); }
      }
      @keyframes blueLegWalk {
        0%, 100% { transform: rotate(-12deg); }
        50% { transform: rotate(12deg); }
      }

      /* === Princess on Horse === */
      .horse {
        position: relative;
        width: 110px;
        height: 80px;
      }
      .horse .horse-body {
        width: 65px;
        height: 32px;
        background: #D7CCC8;
        border-radius: 20px;
        position: absolute;
        bottom: 25px;
        left: 15px;
      }
      .horse .horse-neck {
        width: 10px;
        height: 28px;
        background: #BCAAA4;
        position: absolute;
        bottom: 42px;
        right: 18px;
        transform: rotate(-15deg);
        transform-origin: bottom center;
        border-radius: 5px 5px 0 0;
      }
      .horse .horse-head {
        width: 32px;
        height: 16px;
        background: #BCAAA4;
        border-radius: 10px 14px 6px 4px;
        position: absolute;
        top: 2px;
        right: 5px;
      }
      .horse .horse-eye {
        width: 4px;
        height: 4px;
        background: #333;
        border-radius: 50%;
        position: absolute;
        top: 4px;
        right: 8px;
      }
      .horse .horse-ear {
        width: 5px;
        height: 10px;
        background: #BCAAA4;
        position: absolute;
        top: -7px;
        right: 14px;
        border-radius: 3px 3px 0 0;
        transform: rotate(10deg);
      }
      .horse .horse-mane {
        width: 14px;
        height: 10px;
        background: #5D4037;
        position: absolute;
        top: 6px;
        right: 16px;
        border-radius: 0 5px 8px 0;
        animation: maneFlow 0.4s ease-in-out infinite;
      }
      .horse .horse-tail {
        width: 22px;
        height: 5px;
        background: #5D4037;
        position: absolute;
        bottom: 38px;
        left: 5px;
        border-radius: 5px 0 0 5px;
        transform-origin: right center;
        animation: horsetailFlow 0.5s ease-in-out infinite;
      }
      .horse .horse-leg {
        width: 5px;
        height: 24px;
        background: #A1887F;
        position: absolute;
        bottom: 0;
        transform-origin: top center;
      }
      .horse .horse-leg-fl { left: 60px; animation: gallopFront 0.3s ease-in-out infinite; }
      .horse .horse-leg-fr { left: 68px; animation: gallopFront 0.3s ease-in-out infinite 0.15s; }
      .horse .horse-leg-bl { left: 20px; animation: gallopBack 0.3s ease-in-out infinite; }
      .horse .horse-leg-br { left: 28px; animation: gallopBack 0.3s ease-in-out infinite 0.15s; }
      .princess-tiara {
        width: 18px;
        height: 10px;
        background: #FFD700;
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        clip-path: polygon(0% 100%, 10% 30%, 30% 80%, 50% 0%, 70% 80%, 90% 30%, 100% 100%);
      }
      .princess-hair {
        position: absolute;
        top: 10px;
        left: -3px;
        width: 3px;
        height: 30px;
        background: #FFD54F;
        border-radius: 0 0 5px 5px;
        animation: princessHairFlow 0.5s ease-in-out infinite;
      }
      .princess-hair-2 {
        position: absolute;
        top: 8px;
        left: -7px;
        width: 3px;
        height: 25px;
        background: #FFCA28;
        border-radius: 0 0 5px 5px;
        animation: princessHairFlow 0.5s ease-in-out infinite reverse;
      }
      .princess-dress {
        width: 18px;
        height: 16px;
        background: #F48FB1;
        position: absolute;
        top: 38px;
        left: 50%;
        transform: translateX(-50%);
        clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
        border-radius: 0 0 3px 3px;
      }

      @keyframes gallopFront {
        0%, 100% { transform: rotate(-30deg); }
        50% { transform: rotate(30deg); }
      }
      @keyframes gallopBack {
        0%, 100% { transform: rotate(30deg); }
        50% { transform: rotate(-30deg); }
      }
      @keyframes maneFlow {
        0%, 100% { transform: skewX(0deg); }
        50% { transform: skewX(-10deg); }
      }
      @keyframes horsetailFlow {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(20deg); }
      }
      @keyframes princessHairFlow {
        0%, 100% { transform: rotate(-8deg); }
        50% { transform: rotate(8deg); }
      }

      /* === Mermaid === */
      .mermaid {
        position: relative;
        width: 40px;
        height: 78px;
      }
      .mermaid .mermaid-head {
        width: 16px;
        height: 16px;
        border: 3px solid var(--stick-color);
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .mermaid .mermaid-hair {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 3px;
        height: 25px;
        background: #FF7043;
        border-radius: 0 0 3px 3px;
        animation: mermaidHairWave 1s ease-in-out infinite;
      }
      .mermaid .mermaid-hair-2 {
        position: absolute;
        top: 8px;
        right: 5px;
        width: 3px;
        height: 22px;
        background: #FF8A65;
        border-radius: 0 0 3px 3px;
        animation: mermaidHairWave 1s ease-in-out infinite reverse;
      }
      .mermaid .mermaid-torso {
        width: 3px;
        height: 18px;
        background: var(--stick-color);
        position: absolute;
        top: 18px;
        left: 50%;
        transform: translateX(-50%);
      }
      .mermaid .mermaid-top {
        width: 14px;
        height: 5px;
        background: #AB47BC;
        border-radius: 3px;
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
      }
      .mermaid .mermaid-arm {
        width: 3px;
        height: 18px;
        background: var(--stick-color);
        position: absolute;
        top: 20px;
        transform-origin: top center;
      }
      .mermaid .mermaid-arm-left { left: calc(50% - 3px); animation: swimArm 0.8s ease-in-out infinite; }
      .mermaid .mermaid-arm-right { left: calc(50%); animation: swimArm 0.8s ease-in-out infinite reverse; }
      .mermaid .mermaid-tail {
        width: 12px;
        height: 30px;
        background: #26A69A;
        border-radius: 6px 6px 4px 4px;
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        animation: tailSwim 0.6s ease-in-out infinite;
        transform-origin: top center;
      }
      .mermaid .mermaid-fin {
        width: 24px;
        height: 10px;
        background: #00897B;
        border-radius: 50%;
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
      }
      .mermaid .mermaid-scales {
        position: absolute;
        top: 8px;
        left: 1px;
        width: 10px;
        height: 3px;
        border-bottom: 2px solid #2BB5A0;
        border-radius: 50%;
      }
      .mermaid .mermaid-scales-2 {
        position: absolute;
        top: 14px;
        left: 2px;
        width: 8px;
        height: 3px;
        border-bottom: 2px solid #2BB5A0;
        border-radius: 50%;
      }
      .anim-mermaid {
        animation: mermaidBob 1.5s ease-in-out infinite;
      }
      .move-swim {
        animation: moveSwim 10s linear forwards;
      }

      @keyframes mermaidHairWave {
        0%, 100% { transform: rotate(-10deg); }
        50% { transform: rotate(10deg); }
      }
      @keyframes swimArm {
        0%, 100% { transform: rotate(-40deg); }
        50% { transform: rotate(40deg); }
      }
      @keyframes tailSwim {
        0%, 100% { transform: translateX(-50%) rotate(-12deg); }
        50% { transform: translateX(-50%) rotate(12deg); }
      }
      @keyframes mermaidBob {
        0%, 100% { transform: translateY(0) rotate(-3deg); }
        50% { transform: translateY(-12px) rotate(3deg); }
      }
      @keyframes moveSwim {
        0% { left: -100px; bottom: 150px; }
        25% { bottom: 280px; }
        50% { bottom: 180px; }
        75% { bottom: 240px; }
        100% { left: 110%; bottom: 200px; }
      }

      /* === Football Kicker === */
      .football {
        width: 14px;
        height: 14px;
        background: white;
        border: 2px solid #333;
        border-radius: 50%;
        position: absolute;
      }
      .football::after {
        content: '';
        width: 6px;
        height: 6px;
        background: #333;
        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        position: absolute;
        top: 3px;
        left: 3px;
      }
      .anim-kick .leg-left { animation: walkLeg 0.3s ease-in-out infinite; }
      .anim-kick .leg-right { animation: kickLeg 2s ease-in-out infinite; }
      .anim-kick .arm-left { animation: walkArm 0.3s ease-in-out infinite; }
      .anim-kick .arm-right { animation: walkArm 0.3s ease-in-out infinite reverse; }

      @keyframes kickLeg {
        0%, 65% { transform: rotate(-25deg); }
        75% { transform: rotate(-35deg); }
        85% { transform: rotate(70deg); }
        100% { transform: rotate(-25deg); }
      }
      @keyframes ballFly {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        35% { transform: translate(60px, -100px) rotate(280deg); }
        100% { transform: translate(150px, -20px) rotate(720deg); opacity: 0; }
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

  create_figure67() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-figure67';
    const person = this.createStickPerson();

    // Replace the circle head with "67" text
    const head = person.querySelector('.head');
    head.style.border = 'none';
    const textHead = document.createElement('div');
    textHead.className = 'figure67-head';
    textHead.textContent = '67';
    person.appendChild(textHead);

    wrapper.appendChild(person);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_cowboyOx() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-slow';
    container.style.bottom = '10px';

    const ox = document.createElement('div');
    ox.className = 'ox';
    ox.innerHTML = `
      <div class="ox-tail"></div>
      <div class="ox-body"></div>
      <div class="ox-head">
        <div class="ox-horn ox-horn-left"></div>
        <div class="ox-horn ox-horn-right"></div>
      </div>
      <div class="ox-leg ox-leg-1"></div>
      <div class="ox-leg ox-leg-2"></div>
      <div class="ox-leg ox-leg-3"></div>
      <div class="ox-leg ox-leg-4"></div>
    `;

    // Cowboy riding on top
    const cowboy = document.createElement('div');
    cowboy.className = 'anim-shoot';
    cowboy.style.cssText = 'position: absolute; bottom: 38px; left: 20px; transform: scale(0.55);';
    const person = this.createStickPerson();
    const hat = document.createElement('div');
    hat.className = 'cowboy-hat';
    person.appendChild(hat);
    const gun = document.createElement('div');
    gun.className = 'gun';
    gun.style.cssText = 'left: 30px; top: 20px;';
    person.appendChild(gun);
    cowboy.appendChild(person);
    ox.appendChild(cowboy);
    container.appendChild(ox);

    // Bullets
    const bulletInterval = setInterval(() => {
      const bullet = document.createElement('div');
      bullet.className = 'bullet';
      bullet.style.cssText = 'left: 55px; top: 22px;';
      person.appendChild(bullet);
      setTimeout(() => bullet.remove(), 500);
    }, 800);

    document.body.appendChild(container);
    setTimeout(() => clearInterval(bulletInterval), 14000);
    this.cleanupAndSchedule(container, 14500);
  }

  create_coolGuy() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.alignItems = 'flex-end';

    // Cool guy leader
    const leader = document.createElement('div');
    leader.className = 'anim-cool';
    const person = this.createStickPerson();

    // Wavy hair
    const hair = document.createElement('div');
    hair.className = 'wavy-hair';
    for (let i = 0; i < 5; i++) {
      const strand = document.createElement('div');
      strand.className = 'strand';
      hair.appendChild(strand);
    }
    person.appendChild(hair);

    // Sunglasses
    const glasses = document.createElement('div');
    glasses.className = 'sunglasses';
    person.appendChild(glasses);

    leader.appendChild(person);
    container.appendChild(leader);

    // 3 followers walking behind
    for (let i = 0; i < 3; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'anim-walk';
      wrapper.style.transform = 'scale(0.75)';
      wrapper.style.animationDelay = `${i * 0.1}s`;
      wrapper.appendChild(this.createStickPerson());
      container.appendChild(wrapper);
    }

    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_speaking() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-walk';
    const person = this.createStickPerson();

    // Speech bubble
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = 'Hej!';
    person.appendChild(bubble);

    wrapper.appendChild(person);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_airplane() {
    const container = document.createElement('div');
    container.className = 'stick-container move-fly-plane';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-airplane';

    const plane = document.createElement('div');
    plane.className = 'airplane';
    plane.innerHTML = `
      <div class="tail-fin"></div>
      <div class="fuselage"></div>
      <div class="wing"></div>
      <div class="cockpit"></div>
      <div class="propeller"></div>
    `;
    wrapper.appendChild(plane);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 8500);
  }

  create_ufo() {
    const container = document.createElement('div');
    container.className = 'stick-container move-fly-ufo';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-ufo';

    const ufo = document.createElement('div');
    ufo.className = 'ufo';
    ufo.innerHTML = `
      <div class="dome"></div>
      <div class="saucer"></div>
      <div class="ufo-lights">
        <div class="ufo-light"></div>
        <div class="ufo-light"></div>
        <div class="ufo-light"></div>
        <div class="ufo-light"></div>
      </div>
      <div class="beam"></div>
    `;
    wrapper.appendChild(ufo);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_shawarma() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-shawarma';

    const shawarma = document.createElement('div');
    shawarma.className = 'shawarma';
    shawarma.innerHTML = `
      <div class="wrap">
        <div class="filling filling-1"></div>
        <div class="filling filling-2"></div>
        <div class="filling filling-3"></div>
        <div class="filling filling-4"></div>
        <div class="filling filling-5"></div>
        <div class="filling filling-6"></div>
      </div>
      <div class="shawarma-eyes">
        <div class="shawarma-eye"></div>
        <div class="shawarma-eye"></div>
      </div>
      <div class="shawarma-leg shawarma-leg-left">
        <div class="shawarma-foot"></div>
      </div>
      <div class="shawarma-leg shawarma-leg-right">
        <div class="shawarma-foot"></div>
      </div>
    `;
    wrapper.appendChild(shawarma);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_darkFigure() {
    // Only appears in dark mode (22:00 - 06:00)
    let isDark = false;
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) isDark = true;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dark') === '1') isDark = true;
    if (urlParams.get('dark') === '0') isDark = false;

    if (!isDark) {
      // Not dark mode - skip and pick another animation
      this.isAnimating = false;
      this.scheduleNextAnimation();
      return;
    }

    const container = document.createElement('div');
    container.className = 'stick-container move-dark';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-dark';

    const figure = document.createElement('div');
    figure.className = 'dark-figure';
    figure.innerHTML = `
      <div class="hood">
        <div class="dark-eyes">
          <div class="dark-eye"></div>
          <div class="dark-eye"></div>
        </div>
      </div>
      <div class="cloak"></div>
      <div class="dark-leg dark-leg-left"></div>
      <div class="dark-leg dark-leg-right"></div>
    `;
    wrapper.appendChild(figure);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 14500);
  }

  create_giant() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-giant';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-giant';
    wrapper.appendChild(this.createStickPerson());
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 18500);
  }

  create_creeper() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';

    const creeper = document.createElement('div');
    creeper.className = 'creeper';
    creeper.innerHTML = `
      <div class="creeper-head">
        <div class="creeper-eye creeper-eye-left"></div>
        <div class="creeper-eye creeper-eye-right"></div>
        <div class="creeper-mouth-left"></div>
        <div class="creeper-mouth-center"></div>
        <div class="creeper-mouth-right"></div>
      </div>
      <div class="creeper-body"></div>
      <div class="creeper-leg creeper-leg-front"></div>
      <div class="creeper-leg creeper-leg-back"></div>
    `;
    container.appendChild(creeper);
    document.body.appendChild(container);

    // Start flashing white at 5s
    setTimeout(() => {
      creeper.classList.add('anim-creeper-flash');
    }, 5000);

    // Explode at 6.5s
    setTimeout(() => {
      creeper.style.display = 'none';
      container.style.animationPlayState = 'paused';

      // Flash
      const flash = document.createElement('div');
      flash.className = 'explosion-flash';
      container.appendChild(flash);

      // Particles
      const colors = ['#4CAF50', '#388E3C', '#666', '#ff6b35', '#FFD700'];
      for (let i = 0; i < 24; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        const angle = (Math.PI * 2 * i) / 24;
        const distance = 40 + Math.random() * 80;
        particle.style.setProperty('--ex', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ey', `${Math.sin(angle) * distance}px`);
        particle.style.setProperty('--explode-duration', `${0.4 + Math.random() * 0.5}s`);
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = '20px';
        particle.style.top = '30px';
        container.appendChild(particle);
      }
    }, 6500);

    this.cleanupAndSchedule(container, 8500);
  }

  create_rainbowBlue() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-slow';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-rfblue';

    const blue = document.createElement('div');
    blue.className = 'rf-blue';
    blue.innerHTML = `
      <div class="rf-head">
        <div class="rf-crown"></div>
        <div class="rf-eye-right"></div>
        <div class="rf-eye-left">
          <div class="rf-button-h"></div>
          <div class="rf-button-v"></div>
        </div>
        <div class="rf-drool"></div>
      </div>
      <div class="rf-body"></div>
      <div class="rf-arm rf-arm-left"></div>
      <div class="rf-arm rf-arm-right"></div>
      <div class="rf-leg rf-leg-left"></div>
      <div class="rf-leg rf-leg-right"></div>
    `;
    wrapper.appendChild(blue);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 14500);
  }

  create_princessHorse() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right-fast';
    container.style.bottom = '10px';

    const horse = document.createElement('div');
    horse.className = 'horse';
    horse.innerHTML = `
      <div class="horse-tail"></div>
      <div class="horse-body"></div>
      <div class="horse-neck">
        <div class="horse-mane"></div>
      </div>
      <div class="horse-head">
        <div class="horse-eye"></div>
        <div class="horse-ear"></div>
      </div>
      <div class="horse-leg horse-leg-fl"></div>
      <div class="horse-leg horse-leg-fr"></div>
      <div class="horse-leg horse-leg-bl"></div>
      <div class="horse-leg horse-leg-br"></div>
    `;

    // Princess riding on top
    const princess = document.createElement('div');
    princess.style.cssText = 'position: absolute; bottom: 45px; left: 30px; transform: scale(0.55);';
    const person = this.createStickPerson();
    const tiara = document.createElement('div');
    tiara.className = 'princess-tiara';
    person.appendChild(tiara);
    const hair1 = document.createElement('div');
    hair1.className = 'princess-hair';
    person.appendChild(hair1);
    const hair2 = document.createElement('div');
    hair2.className = 'princess-hair-2';
    person.appendChild(hair2);
    const dress = document.createElement('div');
    dress.className = 'princess-dress';
    person.appendChild(dress);
    princess.appendChild(person);
    horse.appendChild(princess);

    container.appendChild(horse);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 6500);
  }

  create_mermaid() {
    const container = document.createElement('div');
    container.className = 'stick-container move-swim';

    const wrapper = document.createElement('div');
    wrapper.className = 'anim-mermaid';

    const mermaid = document.createElement('div');
    mermaid.className = 'mermaid';
    mermaid.innerHTML = `
      <div class="mermaid-head"></div>
      <div class="mermaid-hair"></div>
      <div class="mermaid-hair-2"></div>
      <div class="mermaid-torso"></div>
      <div class="mermaid-top"></div>
      <div class="mermaid-arm mermaid-arm-left"></div>
      <div class="mermaid-arm mermaid-arm-right"></div>
      <div class="mermaid-tail">
        <div class="mermaid-scales"></div>
        <div class="mermaid-scales-2"></div>
        <div class="mermaid-fin"></div>
      </div>
    `;
    wrapper.appendChild(mermaid);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    this.cleanupAndSchedule(container, 10500);
  }

  create_footballKicker() {
    const container = document.createElement('div');
    container.className = 'stick-container move-right';
    const wrapper = document.createElement('div');
    wrapper.className = 'anim-kick';
    wrapper.style.position = 'relative';
    const person = this.createStickPerson();
    wrapper.appendChild(person);
    container.appendChild(wrapper);

    // Kick a ball every 2s (synced with kick leg animation)
    const kickBall = () => {
      const ball = document.createElement('div');
      ball.className = 'football';
      ball.style.cssText = 'right: -10px; bottom: 0; position: absolute;';
      ball.style.animation = 'ballFly 1.2s ease-out forwards';
      wrapper.appendChild(ball);
      setTimeout(() => ball.remove(), 1200);
    };

    setTimeout(kickBall, 1700);
    const kickInterval = setInterval(kickBall, 2000);

    document.body.appendChild(container);
    setTimeout(() => clearInterval(kickInterval), 10000);
    this.cleanupAndSchedule(container, 10500);
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
