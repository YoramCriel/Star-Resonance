const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

const Application = PIXI.Application,
  Graphics = PIXI.Graphics;

const ellipses = [];

let app;
const bounds = [];
let mute, notmuted;

const init = () => {
  setupPixiApp();
  backgroundImage();
  drawMuteIcons();
  window.addEventListener(`click`, drawEllipse);
  circleOuterBoxCollision();
  backgroundAudio();
};

const circleOuterBoxCollision = () => {
  const ellipseBoundsPadding = 100; //collision kader instellen
  const ellipseBounds = new PIXI.Rectangle(- ellipseBoundsPadding,
                                    - ellipseBoundsPadding,
                                    app.renderer.width + ellipseBoundsPadding * 2,
                                    app.renderer.height + ellipseBoundsPadding * 2);

  app.ticker.add(() => {
    // bounds = [];
    // iterate through the ellipses and update their position
    ellipses.forEach((ellipse, i) => {

      //console.log(i);

      ellipse.direction += ellipse.turningSpeed * 0.01;
      ellipse.x += Math.sin(ellipse.direction) * ellipse.speed;
      ellipse.y += Math.cos(ellipse.direction) * ellipse.speed;
      //ellipse.rotation = - ellipse.direction - Math.PI / 2;

      //Controleer of er collision is
      //Left
      if (ellipse.x < ellipseBounds.x) {
        ellipse.x += ellipseBounds.width;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`left`);
      }
      //Right
      else if (ellipse.x > ellipseBounds.x + ellipseBounds.width) {
        ellipse.x -= ellipseBounds.width;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`right`);
      }
      //Top
      if (ellipse.y < ellipseBounds.y) {
        ellipse.y += ellipseBounds.height;
        app.stage.removeChild(ellipse);
        audioEffect();
        ellipses.splice(i, 1);
        console.log(`top`);
      }
      //Bottom
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
};

const drawEllipse = e => {

  //Geen circle op mute button
  if (e.clientX > app.renderer.width -  notmuted.width - 20 && e.clientX > app.renderer.height) {
    return;
  }

  //Cirkel aanmaken
  const ellipse = new Graphics();
  ellipse.beginFill(0xFFFF00);
  ellipse.drawEllipse(0, 0, 50, 50);
  ellipse.endFill();
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


//Background
const backgroundImage = () => {
  const texture = PIXI.Texture.fromImage(`assets/img/stars3.jpg`);
  const tilingSprite = new PIXI.extras.TilingSprite(texture, app.renderer.width, app.renderer.height);
  app.stage.addChild(tilingSprite);

  let count = 0;
  let countingDown = false;

  //Background annimatie
  app.ticker.add(function () {

    tilingSprite.tileScale.x = 2 + Math.sin(count);
    tilingSprite.tileScale.y = 2 + Math.cos(count);

    tilingSprite.tilePosition.x += 1;
    tilingSprite.tilePosition.y += 1;

    if (count > 20) {
      countingDown = true;
    }
    if (count <  0) {
      countingDown = false;
    }
    if (countingDown === true) {
      //Reset scaling
      tilingSprite.tileScale.x = 2;
      tilingSprite.tileScale.y = 2;
      //Verander richting
      count -= 0.005;
    } else {
      count += 0.005;
    }
  });
};

//Setup App
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

// Er voor zorgen dat de grote aangepast wordt wanneer het venster in grote veranderd.
const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};

//Audio
//Effecten
const audioEffect = () => {
  const randomSong = Math.floor(Math.random() * 6 + 1);
  const effectPlayer = new Tone.Player({
    url: `assets/audio/Sound${randomSong}.m4a`,
    autostart: true,
  });

  effectPlayer.toMaster();
};

//Background audio
let backgroundPlayer;

const backgroundAudio = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });
  backgroundPlayer.toMaster();
};


//Mute background audio
const drawMuteIcons = () => {

  const padding = 20;
  const buttonWidth = 60;
  const buttonHeight = 60;

  mute = PIXI.Sprite.fromImage(`assets/img/mute.png`);
  mute.width = buttonWidth;
  mute.height = buttonHeight;
  mute.position.set(app.renderer.width - mute.width - padding, app.renderer.height - mute.height - padding);
  mute.interactive = true;
  mute.buttonMode = true;
  mute.visible = false;
  mute.on(`pointerdown`, down);
  app.stage.addChild(mute);

  notmuted = PIXI.Sprite.fromImage(`assets/img/notmuted.png`);
  notmuted.width = buttonWidth;
  notmuted.height = buttonHeight;
  notmuted.position.set(app.renderer.width -  notmuted.width - padding, app.renderer.height -  notmuted.height - padding);
  notmuted.interactive = true;
  notmuted.buttonMode = true;
  notmuted.visible = true;
  notmuted.on(`pointerdown`, down);
  app.stage.addChild(notmuted);
};

let muted = true;
const down = () => {
  if (muted === true) {
    backgroundPlayer.mute = true;
    muted = false;
    notmuted.visible = false;
    mute.visible = true;

  } else if (muted === false) {
    backgroundPlayer.mute = false;
    muted = true;
    mute.visible = false;
    notmuted.visible = true;
  }
};

init();
