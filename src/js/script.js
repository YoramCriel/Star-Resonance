const PIXI = require(`pixi.js`);
const Tone = require(`tone`);

//Global
let app;
let bg;
let mousePos;
let star;
let WIDTH, HEIGHT;
const particles = [];
const lines = [];
const meteors = [];
// const hoverMeteors = [];
const connectedMeteors = [];
const meteorLines = [];
let startApp = false;
let secondStep = false;
let thirdStep = false;
let fourthStep = false;
let allConnected = false;
let startPulling = false;

//tone
let vol;
let bgMusic;
let connectSound;
let pullSound;
const highestVol = 20;
const lowestVol = 2;

//Customizable
const starEasing = 0.04;
// const meteorEasing = 0.02;
const deleteAt = 50;
// const pullAt =  5;
const pullingSpeed = 0.02;
const timeInterval = 1000;

//Initialize
const init = () => {
  setupApp();
  createElements();
  beforeStarting();
  draw();
};

const beforeStarting = () => {
  const rect = new PIXI.Graphics();
  rect.beginFill(0x000000, 0.6);
  rect.drawRect(0, 0, WIDTH, HEIGHT);

  const blurFilter = new PIXI.filters.BlurFilter(20);
  rect.filters = [blurFilter];
  app.stage.addChild(rect);

  const style = new PIXI.TextStyle({
    fontFamily: `Verdana`,
    fontSize: 36,
    letterSpacing: 2,
    fontWeight: `lighter`,
    fill: `#ffffff`
  });

  const title = new PIXI.Text(`Star Resonance`, style);
  title.anchor.set(0.5);
  title.x = WIDTH / 2;
  title.y = HEIGHT / 3;
  app.stage.addChild(title);

  const subtitleStyle = new PIXI.TextStyle({
    fontFamily: `Verdana`,
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: `lighter`,
    fill: `#ffffff`
  });

  const subtitle = new PIXI.Text(`Start`, subtitleStyle);
  subtitle.anchor.set(0.5);
  subtitle.x = WIDTH / 2;
  subtitle.y = HEIGHT / 2 + 100;
  subtitle.interactive = true;
  subtitle.buttonMode = true;
  subtitle.on(`pointerdown`, () => {
    app.stage.removeChild(rect);
    app.stage.removeChild(title);
    app.stage.removeChild(subtitle);
    startedTheApp();
  });
  app.stage.addChild(subtitle);
};

const startedTheApp = () => {
  const text = createText(`Start moving`);
  setTimeout(() => {
    app.stage.addChild(text);
  }, timeInterval);

  setTimeout(() => {
    startApp = true;
  }, timeInterval * 3);

  setTimeout(() => {
    app.stage.removeChild(text);
  }, timeInterval * 5);

  const connectText = createText(`Connect the stars by clicking on them`);
  setTimeout(() => {
    app.stage.addChild(connectText);
  }, timeInterval * 15);

  setTimeout(() => {
    secondStep = true;
    app.stage.removeChild(connectText);
  }, timeInterval * 20);
};

const createText = string => {
  const style = new PIXI.TextStyle({
    fontFamily: `Verdana`,
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: `lighter`,
    fill: `#ffffff`
  });
  const text = new PIXI.Text(string, style);
  text.x = WIDTH / 2;
  text.y = HEIGHT / 3;
  text.anchor.set(0.5);
  return text;
};

const createElements = () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  mousePos = getMousePosition();

  createBackground();
  createBgMusic();
  loadSoundFiles();
  createStar();

  for (let i = 0;i < 15;i ++) {
    const meteor = createMeteor({
      x: WIDTH + Math.random() * (WIDTH * 2),
      y: Math.random() * HEIGHT,
      color: 0xffffff,
      alpha: 0.85,
      index: i
    });
    meteors.push(meteor);
  }
};

const draw = () => {
  app.ticker.add(() => {
    animateBackground();

    if (!startApp) return;
    animateStar();
    createParticle(mousePos);
    createLine({from: mousePos, to: star, color: 0x440000});

    if (lines.length >= deleteAt) {
      deleteElement({arr: lines, index: 0});
      deleteElement({arr: particles, index: 0});
    }

    if (!secondStep) return;
    if (meteors.length < 1) {
      allConnected = true;
    }
    meteors.forEach(meteor => animateMeteor(meteor));
    animateMeteorLines();
    animateConnectedMeteors();
  });
};

/* ===== CREATION ===== */
/* #1 App */
const setupApp = () => {
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialiasing: true,
    transparent: false,
    resolution: 1
  });

  document.body.appendChild(app.view);
};

/* #2 Background */
const createBackground = () => {
  const texture = PIXI.Texture.fromImage(`assets/img/stars3.jpg`);
  bg = new PIXI.extras.TilingSprite(texture, app.renderer.width, app.renderer.height);
  app.stage.addChild(bg);
};

/* #2.5 Background music */
const createBgMusic = () => {
  bgMusic = new Tone.Player({
    url: `assets/audio/139050__anankalisto__resonance-of-the-gods.wav`,
    loop: true,
    autostart: true
  });

  bgMusic.toMaster();
  vol = new Tone.Volume(lowestVol);
  bgMusic.chain(vol, Tone.Master);
};

/* load files */
const loadSoundFiles = () => {
  connectSound = new Tone.Player({
    url: `assets/audio/42095__fauxpress__bell-meditation.mp3`,
  });
  connectSound.toMaster();

  pullSound = new Tone.Player({
    url: `assets/audio/56364__suonho__ambienta-soundtrack-crystal-airlines-c4-100bpm.wav`
  });
  pullSound.toMaster();
};

/* #3 Star */
const createStar = () => {
  star = PIXI.Sprite.fromImage(`assets/img/main-star.png`);
  star.x = WIDTH / 2;
  star.y = HEIGHT / 2;
  star.anchor.set(0.5);
  star.interactive = true;
  star.pressing = false;
  star.on(`mousedown`, () => {
    if (allConnected) startPulling = true;
    star.pressing = true;
  });
  star.on(`mouseup`, () => {
    star.pressing = false;
  });
  star.on(`pointerupoutside`, () => {
    star.pressing = false;
  });
  app.stage.addChild(star);
};

/* #4 Particle */
const createParticle = pos => {
  const particle = new PIXI.Graphics();
  particle.beginFill(0x110000, 0.7);
  particle.drawEllipse(0, 0, 5, 5);
  particle.endFill();
  particle.x = pos.x;
  particle.y = pos.y;
  app.stage.addChild(particle);
  particles.push(particle);
};

/* #5 Line */
const createLine = ({
  from: pos, to: endPos,
  color: color,
  meteorLine = false
}) => {
  const line = new PIXI.Graphics();

  line.lineStyle(1, color)
   .moveTo(endPos.x, endPos.y)
   .lineTo(pos.x, pos.y);

  app.stage.addChild(line);

  if (meteorLine) {
    meteorLines.push(line);
  } else {
    lines.push(line);
  }
  return line;
};

/* #6 Meteor */
const createMeteor = ({
  x: x, y: y,
  color: color,
  alpha: alpha,
  index: index,
  connected = false
}) => {
  const meteor = new PIXI.Graphics();
  meteor.beginFill(color, alpha);
  meteor.drawEllipse(0, 0, 7, 7);
  meteor.endFill();
  meteor.x = x;
  meteor.y = y;
  meteor.index = index;
  meteor.stuck = false;
  meteor.direction = Math.random() * Math.PI * 2;
  meteor.turningSpeed = Math.random() - 0.8;
  meteor.speed = 2 + Math.random() * 2;
  app.stage.addChild(meteor);

  if (!connected) {
    meteor.interactive = true;
    // meteor.on(`mouseover`, onMeteorHover);
    meteor.on(`pointerdown`, onMeteorClick);
  }

  return meteor;
};

/* ===== ANIMATION ===== */
/* #1 Background */
const animateBackground = () => {
  bg.tilePosition.x -= 0.5;
};

/* #2 Star */
const animateStar = () => {
  const distX = mousePos.x - star.x;
  const distY = mousePos.y - star.y;

  const volX = Math.ceil(Math.max(lowestVol, Math.abs((distX / WIDTH)) * highestVol));
  const volY = Math.ceil(Math.max(lowestVol, Math.abs((distY / HEIGHT)) * highestVol));
  const newVol = Math.max(volX, volY);

  if (newVol <= highestVol) {
    vol.volume.value = Math.max(volX, volY);
  }

  star.x += distX * starEasing;
  star.y += distY * starEasing;
};

/* #3 Meteor */
const animateMeteor = meteor => {
  meteor.x -= 0.8 + Math.random() * 0.9;
  meteor.turningSpeed = Math.random() - 0.2;

  if (meteor.x < - 10) {
    meteor.x = WIDTH + Math.random() * (WIDTH * 2);
  }
};

/* #4 Lines */
const animateMeteorLines = () => {
  meteorLines.forEach((line, i) => {
    const meteor = connectedMeteors[i];

    line.clear();
    line.lineStyle(1, 0xffee00);
    line.moveTo(star.x, star.y);
    line.lineTo(meteor.x, meteor.y);
  });
};

/* #5 Pull and Push meteors */
const animateConnectedMeteors = () => {
  if (startPulling) {
    connectedMeteors.forEach((meteor, i) => {
      const distX = star.x - meteor.x;
      const distY = star.y - meteor.y;

      if (Math.abs(distX) < 2 && Math.abs(distY) < 2) {
        meteor.x += Math.sin(meteor.direction) * 10;
        meteor.y += Math.cos(meteor.direction) * 10;
        deleteElement({arr: meteorLines, index: i});
      } else {
        meteor.x += distX * pullingSpeed;
        meteor.y += distY * pullingSpeed;
      }
    });
    // return;
  }
  // connectedMeteors.forEach((meteor, i) => {
  connectedMeteors.forEach(meteor => {
    const distX = star.x - meteor.x;
    const distY = star.y - meteor.y;

    // if (startPulling) {
    //   meteor.x += distX * pullingSpeed;
    //   meteor.y += distY * pullingSpeed;
    //
    //   if (Math.abs(distX) < 2 && Math.abs(distY) < 2) {
    //     meteor.x += Math.sin(meteor.direction) * 10;
    //     meteor.y += Math.cos(meteor.direction) * 10;
    //     deleteElement({arr: meteorLines, index: i});
    //   }
    // }

    if (!startPulling) {
      if (star.pressing) {
        meteor.x += distX * pullingSpeed;
        meteor.y += distY * pullingSpeed;
      } else {
        meteor.direction += meteor.turningSpeed * 0.01;
        meteor.x += Math.sin(meteor.direction) * meteor.speed;
        meteor.y += Math.cos(meteor.direction) * meteor.speed;
      }
    }


  });

  // if (star.pressing) {
  //   console.log(`pressed`);
  //   // if (pullSound && bgMusic && Tone.BufferSource) {
  //   // pullSound.start();
  //   // bgMusic.stop();
  //   // }
  //
  //   for (let i = 0;i < connectedMeteors.length;i ++) {
  //     const meteor = connectedMeteors[i];
  //     const distX = star.x - meteor.x;
  //     const distY = star.y - meteor.y;
  //
  //     meteor.x += distX * pullingSpeed;
  //     meteor.y += distY * pullingSpeed;
  //   }
  //
  // } else {
  //   // if (pullSound && bgMusic && Tone.BufferSource) {
  //   //   pullSound.stop();
  //   //   bgMusic.start();
  //   // }
  //
  //   for (let i = 0;i < connectedMeteors.length;i ++) {
  //     const meteor = connectedMeteors[i];
  //     meteor.directionX += meteor.turningSpeed * 0.01;
  //     meteor.directionY += meteor.turningSpeed * 0.01;
  //     meteor.x += Math.sin(meteor.directionX) * meteor.speed;
  //     meteor.y += Math.cos(meteor.directionY) * meteor.speed;
  //   }
  // }

};

/* ===== EVENTS ===== */
/* #1 Meteor Hover */
// const onMeteorHover = ({data}) => {
  // const meteor = createMeteor({
  //   x: data.global.x,
  //   y: data.global.y,
  //   color: 0xffee00,
  //   alpha: 0.3
  // });
  //
  // hoverMeteors.push(meteor);
  // setTimeout(() => {
  //   deleteElement({arr: hoverMeteors, index: 0});
  // }, 200);
// };

/* #2 Meteor Click */
const onMeteorClick = ({currentTarget: tar, data}) => {
  if (connectedMeteors.length > 1 && !thirdStep) {
    const pullText = createText(`Hold the main star to pull the other stars`);
    app.stage.addChild(pullText);

    setTimeout(() => {
      app.stage.removeChild(pullText);
      thirdStep = true;
    }, timeInterval * 5);
  }

  if (connectedMeteors.length > 4 && !fourthStep && thirdStep) {
    const pullText = createText(`Connect all the stars`);
    app.stage.addChild(pullText);

    setTimeout(() => {
      fourthStep = true;
      app.stage.removeChild(pullText);
    }, timeInterval * 5);
  }
  const time = connectSound.context.now();
  connectSound.start(time, 1);

  meteors.forEach((m, i) => {
    if (m === tar) {
      meteors.splice(i, 1);
      app.stage.removeChild(tar);
    }
  });

  const meteor = createMeteor({
    x: data.global.x,
    y: data.global.y,
    color: 0xDC143C,
    alpha: 1,
    connected: true
  });

  connectedMeteors.push(meteor);

  createLine({
    from: data.global,
    to: star,
    color: 0xffee00,
    meteorLine: true
  });
};

/* ===== ACTIONS ===== */
const getMousePosition = () => {
  return app.renderer.plugins.interaction.mouse.global;
};

const deleteElement = ({arr = [], index = 0}) => {
  app.stage.removeChild(arr[index]);
  arr.splice(index, 1);
};

//Start app
init();
