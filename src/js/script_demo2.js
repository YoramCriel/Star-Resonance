//Demo 2 Game states

const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app; // Globale variable app

//Pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  Sprite = PIXI.Sprite;

const init = () => {

//------------Tone.js-----------------------------
  const player = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });
  player.toMaster();

//--------------------------------------------------

  setupPixi(); //Venster instellen
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

// Hier zorg ik dat de grote aangepast wordt wanneer het venster in grote veranderd
const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};


let sprite, state;

const loadImages = () => {
  //Images laden in de texture cache zodat ze kunnen gebruikt worden met openGL

  loader
    .add(`assets/img/player.png`)
    .add(`assets/img/charakter.png`)
    .load(setup)
    .on(`progress`, loadProgressHandler);

  function setup() {
    console.log(`All files loaded`);
    //Gewone afbeelding inladen
    sprite = new Sprite(loader.resources[`assets/img/player.png`].texture);
    sprite.position.set(96, 96); //Sprite instellingen.
    sprite.width = 80;
    sprite.height = 120;
    sprite.scale.set(0.5, 0.5);
    sprite.rotation = 0.5;
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite); // Sprite op het scherm zetten
    //app.stage.removeChild(sprite); // Sprite verwijderen.
    sprite.visible = true; // Onzichtbaar zitten is efficienter

    state = play; //State instellem

    app.ticker.add(delta => gameLoop(delta));  // 60x loop aanmaken
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

const loadProgressHandler = (loader, resource) => {
  console.log(`loading: ${  resource.url}`);
  console.log(`progress: ${  loader.progress  }%`);
};

init();
