const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app;

//pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  //resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;
  //Rectangle = PIXI.Rectangle,
  //TextureCache = PIXI.TextureCache;

const init = () => {

  const player = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  player.toMaster();
  setupPixi();
  rerenderAppCanvas();
  loadImages();
};

//venster instellen
const setupPixi = () => {
  app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialiasing: true,
    transparent: false,
    resolution: 1
  });
  document.body.appendChild(app.view);
};

// zorgen dat de grote aangepast wordt wanneer het venster in grote veranderd
const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};


let sprite, state;

const loadImages = () => {
  //images laden in de texture cache zodat ze kunnen gebruikt worden met openGL

  loader
    .add(`assets/img/player.png`)
    .add(`assets/img/charakter.png`)
    .load(setup)
    .on(`progress`, loadProgressHandler);

  function setup() {
    console.log(`All files loaded`);
    sprite = new Sprite(
    loader.resources[`assets/img/player.png`].texture
    );
    sprite.position.set(96, 96);
    sprite.width = 80;
    sprite.height = 120;
    sprite.scale.set(0.5, 0.5);
    sprite.rotation = 0.5;
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite); // sprite op het scherm zetten
    //app.stage.removeChild(sprite); // sprite verwijderen.
    sprite.visible = true; // omzichtbaar zitten is efficienter

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }
};

const gameLoop = delta => {

  //Update the current game state:
  state(delta);
};

const play = delta => {
  console.log(delta);
  //Move the cat 1 pixel to the right each frame
  sprite.vx = 1;
  sprite.x += sprite.vx;
};


const keyboard = keyCode => {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    `keydown`, key.downHandler.bind(key), false
  );
  window.addEventListener(
    `keyup`, key.upHandler.bind(key), false
  );
  return key;
};





const loadProgressHandler = (loader, resource) => {
  console.log(`loading: ${  resource.url}`);
  console.log(`progress: ${  loader.progress  }%`);
};


init();
