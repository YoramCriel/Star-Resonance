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
const starEasing = 0.06;
const meteorEasing = 0.02;
const deleteAt = 50;

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
      alpha: 0.85
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
      deleteElementFromArray({arr: lines, index: 0});
      deleteElementFromArray({arr: particles, index: 0});
    }

    meteors.forEach(meteor => animateMeteor(meteor));

    connectedMeteors.forEach((meteor, i) => {
      const line = meteorLines[i];
      line.clear();
      line.lineStyle(1, 0xffee00);
      line.moveTo(star.x, star.y);
      line.lineTo(meteor.x, meteor.y);
    });

    if (meteorsCalled) {
      for (let i = 0;i < connectedMeteors.length;i ++) {
        const meteor = connectedMeteors[i];
        const distX = star.x - meteor.x;
        const distY = star.y - meteor.y;

        meteor.x += distX * 0.03;
        meteor.y += distY * 0.03;
      }
    }
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
  star.x = 200;
  star.y = 200;
  star.anchor.set(0.5);
  star.interactive = true;
  star.on(`pointerdown`, onStarClick);
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
const createLine = ({from: pos, to: endPos, color: color, meteorLine = false}) => {
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
const createMeteor = ({x: x, y: y, color: color, alpha: alpha}) => {
  const meteor = new PIXI.Graphics();
  meteor.beginFill(color, alpha);
  meteor.drawEllipse(0, 0, 7, 7);
  meteor.endFill();
  //Out the screen on the right side
  meteor.x = x;
  meteor.y = y;
  app.stage.addChild(meteor);

  meteor.interactive = true;
  meteor.on(`mouseover`, onMeteorHover);
  meteor.on(`pointerdown`, onMeteorClick);
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

/* ===== EVENTS ===== */
/* #1 Meteor Hover */
const onMeteorHover = ({data}) => {
  const meteor = createMeteor({
    x: data.global.x,
    y: data.global.y,
    color: 0xffee00,
    alpha: 0.3
  });

  hoverMeteors.push(meteor);
  setTimeout(() => {
    deleteElementFromArray({arr: hoverMeteors, index: 0});
  }, 200);
};

/* #2 Meteor Click */
const onMeteorClick = (e) => {
  console.log(e.currentTarget);
  const {data} = e;
  const meteor = createMeteor({
    x: data.global.x,
    y: data.global.y,
    color: 0xDC143C,
    alpha: 1
  });
  connectedMeteors.push(meteor);

  const line = createLine({
    from: data.global,
    to: star,
    color: 0xffee00,
    meteorLine: true
  });
  meteorsCalled = true;
  meteorLines.push(line);
};

/* #3 Star Click */
const onStarClick = ({data}) => {
  // meteorsCalled = true;
  if (connectedMeteors.length > 0) {
    meteorsCalled = true;
    // app.ticker.add(() => {
    //   for (let i = 0;i < connectedMeteors.length;i ++) {
    //     const meteor = connectedMeteors[i];
    //     const distX = star.x - meteor.x;
    //     const distY = star.y - meteor.y;
    //
    //     meteor.x += distX * 0.03;
    //     meteor.y += distY * 0.03;
    //   }
    // });

  }
};

/* ===== ACTIONS ===== */
const getMousePosition = () => {
  return app.renderer.plugins.interaction.mouse.global;
};

const deleteElementFromArray = ({arr = [], index = 0}) => {
  app.stage.removeChild(arr[index]);
  arr.splice(index, 1);
};

//Start app
init();
