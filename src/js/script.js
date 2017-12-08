const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app;

const init = () => {

  const player = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  player.toMaster();
  setupPixi();
  rerenderAppCanvas();

};

const setupPixi = () => {
  app = new PIXI.Application({
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

init();
