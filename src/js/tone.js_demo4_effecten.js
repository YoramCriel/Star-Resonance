/* eslint-disable */
//tonejs_demo4_effecten
const Tone = require(`tone`);

const init = () => {
  backgroundAudio();
};

let backgroundPlayer;

const backgroundAudio = () => {

  //demo1(); //speel achterstevoren
  //demo2(); //versnelen en vertragen
  //demo3(); //Detroy bits
  //demo4(); //PingPongDelay
  //demo5(); //autoFilter
  //demo6(); //Chebyshev
  //demo7(); //chorus
  //demo8(); //Distortion
  //demo9(); //FeedbackDelay
  //demo10(); //freeverb
  //demo11(); //JCReverb
  //demo12(); //phaser
  //demo13(); //PitchShift
  //demo14(); //StereoWidener
  //demo15(); //tremolo
  //demo16(); //vibrato
  //demo17(); //noise
};

//noise
const demo17 = () => {
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).toMaster();

  var noise = new Tone.Noise("pink").start();
  //make an autofilter to shape the noise
  var autoFilter = new Tone.AutoFilter({
  	"frequency" : "8m",
  	"min" : 800,
  	"max" : 15000
  }).connect(Tone.Master);

  //connect the noise
  noise.connect(autoFilter);
  //start the autofilter LFO
  autoFilter.start()
}

//vibrato
const demo16 = () => {
  let vibrato = new Tone.Vibrato(10, 0.5).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(vibrato);
}

//tremolo
const demo15 = () => {
  let tremolo = new Tone.Tremolo(9, 0.75).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(tremolo);
}

//StereoWidener
const demo14 = () => {
  let stereo = new Tone.StereoWidener([5]).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(stereo);
}

 //PitchShift
const demo13 = () => {
  let pitch = new Tone.PitchShift ([4]).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(pitch);
}

//phaser
const demo12 = () => {
  let phaser = new Tone.Phaser({
  	"frequency" : 15,
  	"octaves" : 5,
  	"baseFrequency" : 100
  }).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(phaser);
}

//JCReverb
const demo11 = () => {
  let reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(reverb);
}

//freeverb
const demo10 = () => {
  let freeverb = new Tone.Freeverb().toMaster();
  freeverb.dampening.value = 1000;
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(freeverb);
}

//FeedbackDelay
const demo9 = () => {
  var feedbackDelay = new Tone.FeedbackDelay("1n", 0.5).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(feedbackDelay);
}

//Distortion
const demo8 = () => {
  let dist = new Tone.Distortion(3.8).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(dist)
}

//chorus
const demo7 = () => {
  let chorus = new Tone.Chorus(4, 2.5, 0.5).toMaster();
  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(chorus);
}

//Chebyshev
const demo6 = () => {
  let cheby = new Tone.Chebyshev(50).toMaster();

  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(cheby)
}

//AutoFilter
const demo5 = () => {
  let autoFilter = new Tone.AutoFilter("1n").toMaster();

  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(autoFilter);
}

//PingPongDelay
const demo4 = () => {
  let feedbackDelay = new Tone.PingPongDelay({
      "delayTime" : "8n",
      "feedback" : 0.6,
      "wet" : 0.5
    }).toMaster();

  backgroundPlayer = new Tone.Player({
      url: `assets/audio/Main_song.m4a`,
      autostart: true,
      loop: true,
      playbackRate: 1 ,
    }).connect(feedbackDelay);
}


//Detroy bits
const demo3 = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  backgroundPlayer.toMaster();

  window.addEventListener(`click`, clickHandler);
}

const clickHandler = () => {
  console.log(`here`);
  let crusher = new Tone.BitCrusher(4).toMaster();
  backgroundPlayer.connect(crusher);
}

//versnelen en vertragen
const demo2 = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  backgroundPlayer.toMaster();

  window.addEventListener(`mouseover`, mouseoverHandler)
  window.addEventListener(`mouseout`, mouseleaveHandler)
}

const mouseoverHandler = () => {
  backgroundPlayer.playbackRate = 5;
}

const mouseleaveHandler = () => {
  backgroundPlayer.playbackRate = 1;
}

//speel achterstevoren
const demo1 = () => {
  backgroundPlayer = new Tone.Player({
    url: `assets/audio/Main_song.m4a`,
    autostart: true,
    loop: true,
  });

  backgroundPlayer.toMaster();

  window.addEventListener(`mousedown`, mousedownHandler);
  window.addEventListener(`mouseup`, mouseupHandler);
}

const mousedownHandler = () => {
  backgroundPlayer.reverse = true;
}
const mouseupHandler = () => {
  backgroundPlayer.reverse = false;
}

init();
