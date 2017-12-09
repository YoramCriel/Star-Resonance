//Demo 1 Afbeeding en sprite inladen + bewegen automatisch

const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app; // Globale variable app

//Pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle,
  TextureCache = PIXI.TextureCache;

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


let charakter, sprite; // De 2 afbeeldingen

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
    sprite.position.set(96, 96); // Sprite instellingen.
    sprite.width = 80;
    sprite.height = 120;
    sprite.scale.set(0.5, 0.5);
    sprite.rotation = 0.5;
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite); // Sprite op het scherm zetten
    //app.stage.removeChild(sprite); // Sprite verwijderen.
    sprite.visible = true; // Onzichtbaar zitten is efficienter

    //Stukje van een afbeelding inladen
    const texture = TextureCache[`assets/img/charakter.png`];
    const rectangle = new Rectangle(0, 0, 89, 165); // Welk stukje
    texture.frame = rectangle; // Frame van maken
    charakter = new Sprite(texture); // Sprite aanmaken
    charakter.position.set(500, 500);//Instellingen
    charakter.vx = 0; //Velocity
    charakter.vy = 0;
    app.stage.addChild(charakter); //Op het scherm zetten
    app.renderer.render(app.stage);
    app.ticker.add(delta => gameLoop(delta)); // 60x loop aanmaken

  }
};

//Dit gaat ook met requestAnimationFrame(gameLoop);
const gameLoop = delta => {
  console.log(delta); //Delta heb je normaal niet nodig enkel op trage devices
  // Move the sprite 1 pixel
  // charakter.x += 1 + delta;
  // charakter.y -= 0.4 + delta;
  charakter.vx = 1; //Velocity
  charakter.vy = 1;
  charakter.x += charakter.vx; //Bewegen
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
