const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app;

//pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  //resources = PIXI.loader.resources,
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

const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};



const loadImages = () => {
  //images laden in de texture cache zodat ze kunnen gebruikt worden met openGL
  loader
    .add(`assets/img/player.png`)
    .load(setup);

  function setup() {
    const sprite = new Sprite(
    loader.resources[`assets/img/player.png`].texture
    );
    app.stage.addChild(sprite); // sprite op het scherm zetten
    //app.stage.removeChild(sprite); // sprite verwijderen.
    sprite.visible = true; // omzichtbaar zitten is efficienter
  }
};

init();
