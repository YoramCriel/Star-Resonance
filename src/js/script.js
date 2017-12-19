/* eslint-disable */
const PIXI = require(`pixi.js`);

//Global
let app;
let bg;
let mousePos;
let star;
let WIDTH, HEIGHT;
const particles = [];
const lines = [];
const meteors = [];
const hoverMeteors = [];
const connectedMeteors = [];
const meteorLines = [];
let meteorsCalled = false;

//Customizable
const starEasing = 0.04;
const meteorEasing = 0.02;
const deleteAt = 50;
const pullAt =  5;
const pullingSpeed = 0.02;

//Initialize
const init = () => {
  setupApp();
  createElements();
  draw();
};

const createElements = () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  mousePos = getMousePosition();

  createBackground();
  createStar();

  for (let i = 0;i < 15;i++) {
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
    animateStar();
    createParticle(mousePos);
    createLine({from: mousePos, to: star, color: 0x440000});

    if (lines.length >= deleteAt) {
      deleteElement({arr: lines, index: 0});
      deleteElement({arr: particles, index: 0});
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

/* #3 Star */
const createStar = () => {
  star = PIXI.Sprite.fromImage(`assets/img/main-star.png`);
  star.x = 500;
  star.y = 500;
  star.anchor.set(0.5);
  star.interactive = true;
  star.pressing = false;
  star.on(`mousedown`, () => {
    star.pressing = true;
  });
  star.on(`mouseup`, () => {
    star.pressing = false;
  });
  star.on(`pointerupoutside`, () => {
    star.pressing = false;
  })
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
  //Out the screen on the right side
  meteor.x = x;
  meteor.y = y;
  meteor.index = index;
  meteor.directionX = Math.random() * Math.PI * 2;
  meteor.directionY = Math.random() * Math.PI * 2;
  meteor.turningSpeed = Math.random() - 0.8;
  meteor.speed = 2 + Math.random() * 2;
  app.stage.addChild(meteor);

  if (!connected) {
    meteor.interactive = true;
    meteor.on(`mouseover`, onMeteorHover);
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

  star.x += distX * starEasing;
  star.y += distY * starEasing;
};

/* #3 Meteor */
const animateMeteor = meteor => {
  meteor.x -= 0.8 + Math.random() * 0.9;
  meteor.turningSpeed = Math.random() - 0.2;

  if (meteor.x < -10) {
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
  if (star.pressing) {
    for (let i = 0;i < connectedMeteors.length;i ++) {
      const meteor = connectedMeteors[i];
      const distX = star.x - meteor.x;
      const distY = star.y - meteor.y;

      meteor.x += distX * pullingSpeed;
      meteor.y += distY * pullingSpeed;
    }

  } else {
    for (let i = 0;i < connectedMeteors.length;i ++) {
      const meteor = connectedMeteors[i];
      meteor.directionX += meteor.turningSpeed * 0.01;
      meteor.directionY += meteor.turningSpeed * 0.01;
      meteor.x += Math.sin(meteor.directionX) * meteor.speed;
      meteor.y += Math.cos(meteor.directionY) * meteor.speed;
    }
  }

};

/* ===== EVENTS ===== */
/* #1 Meteor Hover */
const onMeteorHover = ({data}) => {
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
};

/* #2 Meteor Click */
const onMeteorClick = ({currentTarget: tar, data}) => {

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

  const line = createLine({
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
