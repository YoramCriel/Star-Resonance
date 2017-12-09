const Tone = require(`tone`),
  PIXI = require (`pixi.js`);

let app;

//pixi alliassen
const Application = PIXI.Application,
  loader = PIXI.loader,
  //resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  Graphics = PIXI.Graphics,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;
  //Rectangle = PIXI.Rectangle,
  //TextureCache = PIXI.TextureCache;

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


  const rectangle = new Graphics(); //rectangle aanmaken
  rectangle.beginFill(0x66CCFF); //kleur
  rectangle.lineStyle(4, 0xFF3300, 1); // lijndikte, kleur, alpha
  rectangle.drawRect(0, 0, 50, 50); // dementies
  rectangle.endFill();// sluiten
  rectangle.x = 170; // positioneren
  app.stage.addChild(rectangle); // toevoegen aan de stage

  const ellipse = new Graphics();
  ellipse.beginFill(0xFFFF00);
  ellipse.drawEllipse(0, 0, 50, 20);
  ellipse.endFill();
  ellipse.x = 180;
  ellipse.y = 130;
  app.stage.addChild(ellipse);

  //let op ers staat een onzichtbaar vierkant onder, anchor punt links boven

  const roundBox = new Graphics();
  roundBox.lineStyle(4, 0x99CCFF, 1);
  roundBox.beginFill(0xFF9933);
  roundBox.drawRoundedRect(0, 0, 84, 36, 10); // laatste parameter is de radius
  roundBox.endFill();
  roundBox.x = 48;
  roundBox.y = 190;
  app.stage.addChild(roundBox);

  const line = new Graphics();
  line.lineStyle(4, 0xFFFFFF, 1);
  line.moveTo(0, 0);
  line.lineTo(80, 50);
  line.x = 32;
  line.y = 32;
  app.stage.addChild(line);

  const triangle = new Graphics();
  triangle.beginFill(0x66FF33);

  //Use `drawPolygon` to define the triangle as
  //a path array of x/y positions

  triangle.drawPolygon([
    - 32, 64,             //First point
    32, 64,              //Second point
    0, 0                 //Third point
  ]);

  //Fill shape's color
  triangle.endFill();

  //Position the triangle after you've drawn it.
  //The triangle's x/y position is anchored to its first point in the path
  triangle.x = 180;
  triangle.y = 22;

  app.stage.addChild(triangle);

  const message = new Text(`Hello Pixi!`);
  app.stage.addChild(message);
  message.position.set(54, 96); //unstyled text

  //styled text
  const style = new TextStyle({ //style object
    fontFamily: `Arial`,
    fontSize: 36,
    fill: `white`,
    stroke: `#ff3300`,
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: `#000000`,
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  const message2 = new Text(`Hello Pixi!`, style);
  app.stage.addChild(message2);

  let center;
  message2.text = `Text changed!`; // tekst achteraf wijzigen
  message2.style = {fill: `black`, font: `16px PetMe64`}; //stijl achteraf wijzigen
  message2.style = {wordWrap: true, wordWrapWidth: 100, align: center}; //wrap text
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


let sprite, state;

const loadImages = () => {
  //images laden in de texture cache zodat ze kunnen gebruikt worden met openGL
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
    sprite.vx = 0;
    sprite.vy = 0;
    app.stage.addChild(sprite); // sprite op het scherm zetten
    //app.stage.removeChild(sprite); // sprite verwijderen.
    sprite.visible = true; // omzichtbaar zitten is efficienter

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }
};

const gameLoop = delta => {

  //Update the current game state:
  state(delta);
};

const play = delta => {
  console.log(delta);
  //Move the cat 1 pixel to the right each frame
  sprite.x += sprite.vx;
  sprite.y += sprite.vy;
};


const loadProgressHandler = (loader, resource) => {
  console.log(`loading: ${  resource.url}`);
  console.log(`progress: ${  loader.progress  }%`);
};


init();
