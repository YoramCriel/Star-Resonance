const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

const Application = PIXI.Application,
  Graphics = PIXI.Graphics;
let app;
// holder to store the aliens
const ellipses = [];
let bounds = [];

const init = () => {

  setupPixiApp();
  backgroundImage();
  window.addEventListener(`click`, clickHandler);

  const ellipseBoundsPadding = 100;
  const ellipseBounds = new PIXI.Rectangle(- ellipseBoundsPadding,
                                    - ellipseBoundsPadding,
                                    app.renderer.width + ellipseBoundsPadding * 2,
                                    app.renderer.height + ellipseBoundsPadding * 2);

  app.ticker.add(() => {
    bounds = [];
    // iterate through the ellipses and update their position
    ellipses.forEach((ellipse, i) => {

      //console.log(i);

      ellipse.direction += ellipse.turningSpeed * 0.01;
      ellipse.x += Math.sin(ellipse.direction) * ellipse.speed;
      ellipse.y += Math.cos(ellipse.direction) * ellipse.speed;
      //ellipse.rotation = - ellipse.direction - Math.PI / 2;

      // wrap the ellipses by testing their bounds...
      if (ellipse.x < ellipseBounds.x) {
        ellipse.x += ellipseBounds.width;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`left`);
      }
      else if (ellipse.x > ellipseBounds.x + ellipseBounds.width) {
        ellipse.x -= ellipseBounds.width;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`right`);
      }

      if (ellipse.y < ellipseBounds.y) {
        ellipse.y += ellipseBounds.height;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`top`);
      }

      else if (ellipse.y > ellipseBounds.y + ellipseBounds.height) {
        ellipse.y -= ellipseBounds.height;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`bottom`);
      }


      bounds.push(ellipse.getBounds());

    });
    // console.log(bounds);
    //
    // bounds.forEach(bound => {
    //   console.log(bound);
    // });
    // ellipses.forEach(ellipse => {
    //   const bounds1 = ellipse.getBounds();
    //   ellipses.forEach(ellipse2 => {
    //     const bounds2 = ellipse2.getBounds();
    //     console.log(`bounds1`, bounds1);
    //     console.log(`bounds2`, bounds2);
    //     if (bounds1.x === bounds2.x) {
    //       console.log(`hitted`);
    //     }
    //   });
    // });
  });

  backgroundAudio();
};

const clickHandler = e => {


  // create a new Sprite that uses the image name that we just generated as its source
  const ellipse = new Graphics(); //Cirkel aanmaken
  ellipse.beginFill(0xFFFF00);
  ellipse.drawEllipse(0, 0, 50, 50);
  ellipse.endFill();
  //ellipse.anchor.set(0.5);
  ellipse.scale.set(0.8 + Math.random() * 0.3);
  ellipse.x = e.clientX;
  ellipse.y = e.clientY;
  ellipse.tint = Math.random() * 0xFFFFFF;
  ellipse.direction = Math.random() * Math.PI * 2;
  ellipse.turningSpeed = Math.random() - 0.8;
  ellipse.speed = 2 + Math.random() * 2;
  ellipses.push(ellipse);
  app.stage.addChild(ellipse);
};

const backgroundImage = () => {
  const texture = PIXI.Texture.fromImage(`assets/img/stars3.jpg`);
  const tilingSprite = new PIXI.extras.TilingSprite(texture, app.renderer.width, app.renderer.height);
  app.stage.addChild(tilingSprite);

  let count = 0;
  let countingDown = false;

  app.ticker.add(function () {

    tilingSprite.tileScale.x = 2 + Math.sin(count);
    tilingSprite.tileScale.y = 2 + Math.cos(count);

    tilingSprite.tilePosition.x += 1;
    tilingSprite.tilePosition.y += 1;

    if (count > 10) {
      countingDown = true;
    }
    if (count <  0) {
      countingDown = false;
    }
    if (countingDown === true) {
      count -= 0.005;
    } else {
      count += 0.005;
    }

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

const audioEffect = () => {
  const randomSong = Math.floor(Math.random() * 6 + 1);
  const effectPlayer = new Tone.Player({
    url: `assets/audio/Sound${randomSong}.m4a`,
    autostart: true,
  });

  effectPlayer.toMaster();
};

// Er voor zorgen dat de grote aangepast wordt wanneer het venster in grote veranderd
const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};

const backgroundAudio = () => {

  const backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  backgroundPlayer.toMaster();

};

init();
