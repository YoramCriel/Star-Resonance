const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app;

//pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  //resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle,
  TextureCache = PIXI.TextureCache;

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

//venster instellen
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

// zorgen dat de grote aangepast wordt wanneer het venster in grote veranderd
const rerenderAppCanvas = () => {
  window.addEventListener(`resize`, function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};


let charakter;

const loadImages = () => {
  //images laden in de texture cache zodat ze kunnen gebruikt worden met openGL
  let sprite;

  loader
    .add(`assets/img/player.png`)
    .add(`assets/img/charakter.png`)
    .load(setup)
    .on(`progress`, loadProgressHandler);

  function setup() {
    console.log(`All files loaded`);
    sprite = new Sprite(
    loader.resources[`assets/img/player.png`].texture
    );
    sprite.position.set(96, 96);
    sprite.width = 80;
    sprite.height = 120;
    sprite.scale.set(0.5, 0.5);
    sprite.rotation = 0.5;
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite); // sprite op het scherm zetten
    //app.stage.removeChild(sprite); // sprite verwijderen.
    sprite.visible = true; // omzichtbaar zitten is efficienter

    const texture = TextureCache[`assets/img/charakter.png`];
    const rectangle = new Rectangle(0, 0, 89, 165);
    texture.frame = rectangle;
    charakter = new Sprite(texture);
    charakter.position.set(500, 500);
    charakter.vx = 0;
    charakter.vy = 0;
    app.stage.addChild(charakter);
    app.renderer.render(app.stage);
    app.ticker.add(delta => gameLoop(delta));

  }
};

//gaat ook met requestAnimationFrame(gameLoop);
const gameLoop = delta => {
  console.log(delta);
  //Move the cat 1 pixel
  // charakter.x += 1 + delta;
  // charakter.y -= 0.4 + delta;
  charakter.vx = 1;
  charakter.vy = 1;
  charakter.x += charakter.vx;
  charakter.y += charakter.vy;
};


const loadProgressHandler = (loader, resource) => {
    //Display the file `url` currently being loaded
  console.log(`loading: ${  resource.url}`);
    //Display the percentage of files currently loaded
  console.log(`progress: ${  loader.progress  }%`);

    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
};


init();
