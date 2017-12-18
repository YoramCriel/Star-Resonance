const PIXI = require(`pixi.js`);
let app;

export default () => {
  PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialiasing: true,
    transparent: false,
    resolution: 1
  });

  createBackground();
};

const createBackground = () => {
  const texture = PIXI.Texture.fromImage(`assets/img/stars3.jpg`);
  const tilingSprite = new PIXI.extras.TilingSprite(texture, app.renderer.width, app.renderer.height);
  app.stage.addChild(tilingSprite);
};
