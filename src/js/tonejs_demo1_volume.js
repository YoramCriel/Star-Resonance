/* eslint-disable */
const Tone = require(`tone`);
let vol;

const init = () => {
  console.log(`test`);
  backgroundAudio();
};

let backgroundPlayer;
const backgroundAudio = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });
  backgroundPlayer.toMaster();

  //voorbeeld 1

  vol = new Tone.Volume(0);
  backgroundPlayer.chain(vol, Tone.Master);
  window.addEventListener(`mousedown`, fadeMusicUp);
  window.addEventListener(`mouseup`, fadeMusicDown);

  //voorbeeld 2

  // vol = new Tone.Volume(0);
  // backgroundPlayer.chain(vol, Tone.Master);
  // window.addEventListener(`mousemove`, mouseMove);
};

const fadeMusicUp = ()  => {
  vol.volume.value = 20;
};

const fadeMusicDown = ()  => {
  console.log(vol.volume.value);
  vol.volume.value = 0;
  //vol.mute = true;
};

const mouseMove = (e) => { //beweeg de muis van links naar rechts om het geluid aan the passen
  console.log(vol.volume.value);
  vol.volume.value = e.clientX/100;
}

init();
