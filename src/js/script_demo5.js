//Demo 5 collision

const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app; // Globale variable app

//Pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  Sprite = PIXI.Sprite,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;

const init = () => {

//------------Tone.js-----------------------------
  const player = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });
  player.toMaster();
//--------------------------------------------------

  setupPixi();  //Venster instellen
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

let sprite, box, message, state;

const loadImages = () => {
  //Images laden in de texture cache zodat ze kunnen gebruikt worden met openGL

  loader
    .add(`assets/img/player.png`)
    .add(`assets/img/charakter.png`)
    .load(setup)
    .on(`progress`, loadProgressHandler);

  function setup() {

    //Hitbox aanmaken
    box = new PIXI.Graphics();
    box.beginFill(0xCCFF99);
    box.drawRect(0, 0, 64, 64);
    box.endFill();
    box.x = 120;
    box.y = 96;
    app.stage.addChild(box); // Toevoegen aan stage

    console.log(`All files loaded`);
    //Gewone afbeelding inladen
    sprite = new Sprite(loader.resources[`assets/img/player.png`].texture);
    sprite.position.set(96, 96); //Sprite instellingen.
    sprite.width = 80;
    sprite.height = 120;
    sprite.scale.set(0.5, 0.5);
    sprite.rotation = 0.5;
    sprite.anchor.set(0.5, 0.5);
    sprite.vx = 0;
    sprite.vy = 0;
    app.stage.addChild(sprite); // Sprite op het scherm zetten
    //app.stage.removeChild(sprite); // // Sprite verwijderen.
    sprite.visible = true; // Onzichtbaar zitten is efficienter


    //Capture the keyboard arrow keys
    const left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {
      //Change the sprite's velocity when the key is pressed
      sprite.vx = - 5;
      sprite.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function() {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the sprite isn't moving vertically:
      //Stop the sprite
      if (!right.isDown && sprite.vy === 0) {
        sprite.vx = 0;
      }
    };

    //Up
    up.press = function() {
      sprite.vy = - 5;
      sprite.vx = 0;
    };

    up.release = function() {
      if (!down.isDown && sprite.vx === 0) {
        sprite.vy = 0;
      }
    };

    //Right
    right.press = function() {
      sprite.vx = 5;
      sprite.vy = 0;
    };
    right.release = function() {
      if (!left.isDown && sprite.vy === 0) {
        sprite.vx = 0;
      }
    };

    //Down
    down.press = function() {
      sprite.vy = 5;
      sprite.vx = 0;
    };
    down.release = function() {
      if (!up.isDown && sprite.vx === 0) {
        sprite.vy = 0;
      }
    };

    //Create the text sprite
    const style = new TextStyle({
      fontFamily: `sans-serif`,
      fontSize: 18,
      fill: `white`,
    });
    message = new Text(`No collision...`, style);
    message.position.set(8, 8);
    app.stage.addChild(message);

    state = play; //State instellem

    app.ticker.add(delta => gameLoop(delta)); // 60x loop aanmaken
  }
};

const gameLoop = delta => {
  //Update the current game state:
  state(delta);
};

const play = delta => {
  console.log(delta);
  sprite.x += sprite.vx;
  sprite.y += sprite.vy;

  //check for a collision between the sprite and the box
  if (hitTestRectangle(sprite, box)) {

    //if there's a collision, change the message text
    //and tint the box red
    message.text = `hit!`;
    box.tint = 0xff3300;

  } else {

    //if there's no collision, reset the message
    //text and the box's color
    message.text = `No collision...`;
    box.tint = 0xccff99;
  }
};

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  const vx = r1.centerX - r2.centerX;
  const vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

//The `keyboard` helper function
function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
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
}

const loadProgressHandler = (loader, resource) => {
  console.log(`loading: ${  resource.url}`);
  console.log(`progress: ${  loader.progress  }%`);
};

init();
