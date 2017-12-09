const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app;

//pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  Sprite = PIXI.Sprite;

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


//Venster instellen
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

// Er voor zorgen dat de grote aangepast wordt wanneer het venster in grote veranderd
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
    sprite = new Sprite(loader.resources[`assets/img/player.png`].texture);
    sprite.position.set(96, 96); // Instellingen sprite
    sprite.width = 80;
    sprite.height = 120;
    sprite.scale.set(0.5, 0.5);
    sprite.rotation = 0.5;
    sprite.anchor.set(0.5, 0.5);
    sprite.vx = 0;
    sprite.vy = 0;
    app.stage.addChild(sprite); // Sprite op het scherm zetten
    //app.stage.removeChild(sprite); // Sprite verwijderen.
    sprite.visible = true; // Onzichtbaar zitten is efficienter

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
  sprite.vx = 1; //Velocity
  sprite.vy = 1;
  sprite.x += sprite.vx;
  sprite.y += sprite.vy;
};

const loadProgressHandler = (loader, resource) => {
  console.log(`loading: ${  resource.url}`);
  console.log(`progress: ${  loader.progress  }%`);
};


init();
