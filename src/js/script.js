const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

const Application = PIXI.Application,
  Graphics = PIXI.Graphics;
let app;

const init = () => {

  setupPixiApp();
  backgroundImage();

  window.addEventListener(`click`, onClick);
  backgroundAudio();
};


let ellipse;
const ellipsen = [];
const drawElipse = (x, y) => {
  ellipse = new Graphics(); //Cirkel aanmaken
  ellipse.beginFill(0xFFFF00);
  ellipse.drawEllipse(0, 0, 5, 5);
  ellipse.endFill();
  ellipse.x = x;
  ellipse.y = y;
  ellipse.vx = 0;
  ellipse.vy = 0;

  ellipsen.push(ellipse);
  drawAllEllipses();
  app.ticker.add(delta => gameLoop(delta));
};

const gameLoop = () => {
  ellipse.vx = 1; //Velocity
  ellipse.vy = 1;
  ellipse.x += ellipse.vx;
  ellipse.y += ellipse.vy;
  //Update the current game state:

};

const drawAllEllipses = () => {
  console.log(`test`);
  for (let i = 0;i < ellipsen.length;i ++) {
    app.stage.addChild(ellipsen[i]);
  }
};

const onClick = e => {
  console.log(e);
  drawElipse(e.clientX, e.clientY);
};

const backgroundImage = () => {
  const texture = PIXI.Texture.fromImage(`assets/img/stars3.jpg`);
  const tilingSprite = new PIXI.extras.TilingSprite(texture, app.renderer.width, app.renderer.height);
  app.stage.addChild(tilingSprite);

  let count = 0;

  app.ticker.add(function () {

    count += 0.005;

    tilingSprite.tileScale.x = 2 + Math.sin(count);
    tilingSprite.tileScale.y = 2 + Math.cos(count);

    tilingSprite.tilePosition.x += 1;
    tilingSprite.tilePosition.y += 1;

  });
};

//Venster instellen
const setupPixiApp = () => {
  app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialiasing: true,
    transparent: false,
    resolution: 1
  });
  document.body.appendChild(app.view);
  rerenderAppCanvas();
};

// Er voor zorgen dat de grote aangepast wordt wanneer het venster in grote veranderd
const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};


const backgroundAudio = () => {
  const player = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  player.toMaster();

};

init();
