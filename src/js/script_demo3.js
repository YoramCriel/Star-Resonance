//Demo 3 Keyboard gebruiken

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
    sprite.vx = 0;
    sprite.vy = 0;
    app.stage.addChild(sprite); // Sprite op het scherm zetten
    //app.stage.removeChild(sprite); // Sprite verwijderen.
    sprite.visible = true; // Onzichtbaar zitten is efficienter

    const left = keyboard(37), //Keyboard Toetsen instellen
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

    left.press = () => {
      //Change the sprite's velocity when the key is pressed
      sprite.vx = - 5;
      sprite.vy = 0;
    };

    //Left arrow key `release` method
    left.release = () => {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the sprite isn't moving vertically:
      //Stop the sprite
      if (!right.isDown && sprite.vy === 0) {
        sprite.vx = 0;
      }
    };

    //Up
    up.press = () => {
      sprite.vy = - 5;
      sprite.vx = 0;
    };
    up.release = () => {
      if (!down.isDown && sprite.vx === 0) {
        sprite.vy = 0;
      }
    };

    //Right
    right.press = () => {
      sprite.vx = 5;
      sprite.vy = 0;
    };
    right.release = () => {
      if (!left.isDown && sprite.vy === 0) {
        sprite.vx = 0;
      }
    };

    //Down
    down.press = () => {
      sprite.vy = 5;
      sprite.vx = 0;
    };
    down.release = () => {
      if (!up.isDown && sprite.vx === 0) {
        sprite.vy = 0;
      }
    };

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
};


const loadProgressHandler = (loader, resource) => {
  console.log(`loading: ${  resource.url}`);
  console.log(`progress: ${  loader.progress  }%`);
};

const keyboard = keyCode => {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
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
};

init();
