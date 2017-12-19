/* eslint-disable */
const Tone = require(`tone`);

const init = () => {
  backgroundAudio();
};

let backgroundPlayer;
const backgroundAudio = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
    playbackRate: 1 ,
  });

  backgroundPlayer.toMaster();

  //window.addEventListener(`mousedown`, mousedownHandler);
  //window.addEventListener(`mouseup`, mouseupHandler);
  // window.addEventListener(`mouseover`, mouseoverHandler)
  // window.addEventListener(`mouseout`, mouseleaveHandler)
  window.addEventListener(`click`, clickHandler);
};

//speel achterstevoren
const mousedownHandler = () => {
  backgroundPlayer.reverse = true;
}
const mouseupHandler = () => {
  backgroundPlayer.reverse = false;
}

//versnelen en vertragen
const mouseoverHandler = () => {
  backgroundPlayer.playbackRate = 5;
}

const mouseleaveHandler = () => {
  backgroundPlayer.playbackRate = 1;
}

//detroy bits
const clickHandler = () => {
  console.log(`here`);
  let crusher = new Tone.BitCrusher(4).toMaster();
  backgroundPlayer.connect(crusher);
}

init();
