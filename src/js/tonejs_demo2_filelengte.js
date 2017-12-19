/* eslint-disable */
const Tone = require(`tone`);

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



init();
