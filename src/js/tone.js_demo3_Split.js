/* eslint-disable */
const Tone = require(`tone`);
let panner;

const init = () => {
  backgroundAudio();
};

let backgroundPlayer;
const backgroundAudio = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  //backgroundPlayer.toMaster();


  //let merge = new Tone.Merge(backgroundPlayer).connect ( );
  // merge.left.toMaster();
  let split = new Tone.Split().toMaster();
  backgroundPlayer.connect(split);

  console.log(split);
  // split.disconnect(split.left);
  // split.disconnect(split.right);
  // split.left
  // console.log(split.left);
  // split.right.toMaster();
  //voorbeeld3();
  //voorbeeld2(); //nose and sine tone
  //voorbeeld1(); //werkt niet echt
};

const voorbeeld3 = () => {
  //Connect each separate tone to split
  var split = new Tone.Merge().toMaster();
  var leftEar = new Tone.Oscillator();
  var rightEar = new Tone.Oscillator();

  leftEar.frequency.value = 400;
  rightEar.frequency.value = 500;

  leftEar.connect(split.left);
  rightEar.connect(split.right);

  leftEar.start();
  rightEar.start();

  //Frequency is equivalent to difference between frequency in left and right ear
  var frequency = {
    "Gamma" : [30, 50],
    "Beta" : [14, 30],
    "Alpha" : [8, 14],
    "Theta" : [4, 8],
    "Delta" : [0.1, 4]
  };
}

const voorbeeld2 = () => {
  let merge = new Tone.Merge().toMaster();
  //routing a sine tone in the left channel
  //and noise in the right channel
  let osc = new Tone.Oscillator().connect(merge.left);
  let noise = new Tone.Noise().connect(merge.right);
  //starting our oscillators
  noise.start();
  osc.start();
}

const voorbeeld1 = () => {
  panner = new Tone.Panner(0);
  window.addEventListener(`mousedown`, mousedownHandler);
  window.addEventListener(`mouseup`, mouseupHandler);
  console.log(panner.pan);
}

const mousedownHandler = () => {
  console.log(`down`);
  panner.pan.value = -1;
  panner.toMaster();
}

const mouseupHandler = () => {
  console.log(`up`);
  panner.pan.value = 1;
  panner.toMaster();
}

init();
