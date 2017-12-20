/* eslint-disable */
const Tone = require(`tone`);

const init = () => {
  console.log(`test`);
  backgroundAudio();
  window.addEventListener(`mousedown`, downHandler);
  window.addEventListener(`mouseup`, upHandler);
};

let backgroundPlayer;
const backgroundAudio = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/_audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });
  backgroundPlayer.toMaster();

  draw();
};

const draw = () => {
  //console.log(Math.floor(backgroundPlayer.context.currentTime));//tijd die verstreken is
  //console.log(Math.floor(backgroundPlayer.context.now()));//tijd die verstreken is

  //console.log(backgroundPlayer.buffer.duration); //lengte file


  let time = new Tone.Time();
  console.log(Math.floor(time.toSeconds(backgroundPlayer)));//tijd die verstreken is.

  requestAnimationFrame(draw);
}

const downHandler = () => {
  backgroundPlayer.stop();
}

const upHandler = () => {
  let time = backgroundPlayer.context.currentTime;
  backgroundPlayer.start(time, time+50);
}

init();
