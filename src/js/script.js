const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

const Application = PIXI.Application,
  Graphics = PIXI.Graphics;
let app;
// holder to store the aliens
const aliens = [];

const init = () => {

  setupPixiApp();
  backgroundImage();
  window.addEventListener(`click`, clickHandler);


  const ellipseBoundsPadding = 100;
  const ellipseBounds = new PIXI.Rectangle(- ellipseBoundsPadding,
                                    - ellipseBoundsPadding,
                                    app.renderer.width + ellipseBoundsPadding * 2,
                                    app.renderer.height + ellipseBoundsPadding * 2);

  app.ticker.add(function() {

    // iterate through the ellipses and update their position
    for (let i = 0;i < aliens.length;i ++) {

      const ellipse = aliens[i];
      ellipse.direction += ellipse.turningSpeed * 0.01;
      ellipse.x += Math.sin(ellipse.direction) * ellipse.speed;
      ellipse.y += Math.cos(ellipse.direction) * ellipse.speed;
      ellipse.rotation = - ellipse.direction - Math.PI / 2;

        // wrap the ellipses by testing their bounds...
      if (ellipse.x < ellipseBounds.x) {
        ellipse.x += ellipseBounds.width;
      }
      else if (ellipse.x > ellipseBounds.x + ellipseBounds.width) {
        ellipse.x -= ellipseBounds.width;
      }

      if (ellipse.y < ellipseBounds.y) {
        ellipse.y += ellipseBounds.height;
      }
      else if (ellipse.y > ellipseBounds.y + ellipseBounds.height) {
        ellipse.y -= ellipseBounds.height;
      }
    }
  });

  backgroundAudio();
};

const clickHandler = () => {


  // create a new Sprite that uses the image name that we just generated as its source
  const ellipse = new Graphics(); //Cirkel aanmaken
  ellipse.beginFill(0xFFFF00);
  ellipse.drawEllipse(0, 0, 50, 50);
  ellipse.endFill();
  //ellipse.anchor.set(0.5);
  ellipse.scale.set(0.8 + Math.random() * 0.3);
  ellipse.x = Math.random() * app.renderer.width;
  ellipse.y = Math.random() * app.renderer.height;
  ellipse.tint = Math.random() * 0xFFFFFF;
  ellipse.direction = Math.random() * Math.PI * 2;
  ellipse.turningSpeed = Math.random() - 0.8;
  ellipse.speed = 2 + Math.random() * 2;
  aliens.push(ellipse);
  app.stage.addChild(ellipse);



};

// const clickHandler = e => {
//   createEllipse(e.clientX, e.clientY);
// };
//
// let ellipse;
//
// const createEllipse = (x, y) => {
//   ellipse = new Graphics(); //Cirkel aanmaken
//   ellipse.beginFill(0xFFFF00);
//   ellipse.drawEllipse(0, 0, 50, 50);
//   ellipse.endFill();
//   ellipse.x = x;
//   ellipse.y = y;
//   ellipse.vx = 0;
//   ellipse.vy = 0;
//   app.stage.addChild(ellipse);
//
//   app.ticker.add(function () {
//     ellipse.vx = 1; //Velocity
//     ellipse.vy = 1;
//     ellipse.x += ellipse.vx;
//     ellipse.y += ellipse.vy;
//
//   });
// };


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
