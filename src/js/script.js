const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

const Application = PIXI.Application,
  Graphics = PIXI.Graphics;

const ellipses = [];
const particles = [];
const lines = [];

let app;
const bounds = [];
let mute, notmuted;

const init = () => {
  setupPixiApp();
  backgroundImage();
  drawMuteIcons();
  window.addEventListener(`click`, drawEllipse);
  circleOuterBoxCollision();
  // drawEllipse();
  drawParticles();
  backgroundAudio();
};

const drawParticles = () => {
  console.log(`Draw particles`);
  // if (ellipses.length > 0) {
    // ellipses.forEach(el => {
  // console.log(el);
  // for (let i = 50;i < 50;i ++) {
  //   drawParticle();
  // }
    // });
  // }
};

const circleOuterBoxCollision = () => {
  const ellipseBoundsPadding = 100; //collision kader instellen
  const ellipseBounds = new PIXI.Rectangle(
    - ellipseBoundsPadding,
    - ellipseBoundsPadding,
    app.renderer.width + ellipseBoundsPadding * 2,
    app.renderer.height + ellipseBoundsPadding * 2);
  console.log(`circleOuterBox`);
  console.log(`ellipses:`, ellipses);

  // let c = 0;

  app.ticker.add(() => {
    // c ++;
    // if (c === 10) return;
    // bounds = [];
    // iterate through the ellipses and update their position

    for (let i = 0;i < ellipses.length;i ++) {

      const ellipse = ellipses[i];
      let prevEllipse = null;
      if (i > 0) {
        prevEllipse = ellipses[i - 1];
      }

    // console.log(`ellipse.getBounds():`, ellipse.getBounds());

      ellipse.direction += ellipse.turningSpeed * 0.01;
      ellipse.x += Math.sin(ellipse.direction) * ellipse.speed;
      ellipse.y += Math.cos(ellipse.direction) * ellipse.speed;
      ellipse.rotation = - ellipse.direction - Math.PI / 2;

      for (let y = 0;y < lines.length;y ++) {
        const particle = particles[y];
        particle.direction += particle.turningSpeed * 0.1;
        particle.x += Math.sin(particle.direction) * particle.speed;
        particle.y += Math.cos(particle.direction) * particle.speed;

        const line = lines[y];
        // line.moveTo(particle.x, particle.y);
        // line.lineTo(particle.x, particle.y);
        // line.position.set(particle.x, particle.y);
        // line.moveTo(particle.x, particle.y);
        // line.lineTo(ellipse.x, ellipse.y);
        line.x = ellipse.x;
        line.y = ellipse.y;
      }

      // console.log(`ellipse.x, ellipse.y:`, ellipse.x, ellipse.y);

      if (prevEllipse !== null) {
        if (ellipse.x + (ellipse.width / 2) > prevEllipse.x - (prevEllipse.width / 2) &&
        ellipse.x - (ellipse.width / 2) < prevEllipse.x + (prevEllipse.width / 2) &&
        ellipse.y + (ellipse.height / 2) > prevEllipse.y - (prevEllipse.height / 2) &&
        ellipse.y - (ellipse.height / 2) < prevEllipse.y + (prevEllipse.height / 2)
      ) {
          audioEffect();
          console.log(`Collided`);
        }
      }

    //Controleer of er collision is
    //Left
      if (ellipse.x < ellipseBounds.x) {
        ellipse.x += ellipseBounds.width;
        app.stage.removeChild(ellipse);
      // audioEffect();
        ellipses.splice(i, 1);
      // console.log(`left`);
      }
    //Right
      else if (ellipse.x > ellipseBounds.x + ellipseBounds.width) {
        ellipse.x -= ellipseBounds.width;
        app.stage.removeChild(ellipse);
      // audioEffect();
        ellipses.splice(i, 1);
      // console.log(`right`);
      }
    //Top
      if (ellipse.y < ellipseBounds.y) {
        ellipse.y += ellipseBounds.height;
        app.stage.removeChild(ellipse);
      // audioEffect();
        ellipses.splice(i, 1);
      // console.log(`top`);
      }
    //Bottom
      else if (ellipse.y > ellipseBounds.y + ellipseBounds.height) {
        ellipse.y -= ellipseBounds.height;
        app.stage.removeChild(ellipse);
      // audioEffect();
        ellipses.splice(i, 1);
      // console.log(`bottom`);
      }

      bounds.push(ellipse.getBounds());
    }
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
  ellipse.drawEllipse(0, 0, 15, 15);
  ellipse.endFill();
  // ellipse.scale.set(0.8 + Math.random() * 0.3);
  ellipse.x = e.clientX;
  // ellipse.x = 500;
  ellipse.y = e.clientY;
  // ellipse.y = 500;
  ellipse.tint = Math.random() * 0xFFFFFF;
  ellipse.direction = Math.random() * Math.PI * 2;
  ellipse.turningSpeed = Math.random() - 0.8;
  ellipse.speed = 2 + Math.random() * 2;
  ellipses.push(ellipse);
  app.stage.addChild(ellipse);

  for (let i = 0;i < 50;i ++) {
    drawParticle(ellipse.x, ellipse.y);
  }
};

const drawParticle = (mainStarX, mainStarY) => {
  const ellipse = new Graphics();
  ellipse.beginFill(0xFFFF00);
  ellipse.drawEllipse(0, 0, 2, 2);
  ellipse.endFill();
  // ellipse.scale.set(0.8 + Math.random() * 0.3);
  ellipse.x = Math.random() * 600;
  ellipse.y = Math.random() * 600;
  ellipse.direction = Math.random() * Math.PI * 2;
  ellipse.turningSpeed = Math.random() - 0.8;
  ellipse.speed = 2 + Math.random() * 2;
  app.stage.addChild(ellipse);
  particles.push(ellipse);

  const line = new PIXI.Graphics();
  app.stage.addChild(line);

  line.position.set(mainStarX, mainStarY);

  line.lineStyle(1, 0xffffff)
   .moveTo(0, 0)
   .lineTo(ellipse.x, ellipse.y);

  lines.push(line);
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
    // autostart: true,
  });

  effectPlayer.toMaster();
};

//Background audio
let backgroundPlayer;

const backgroundAudio = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    // autostart: true,
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
