const Tone = require(`tone`);

const init = () => {

  const synth = new Tone.Synth().toMaster();
  synth.triggerAttackRelease(`C4`, `8n`);

  console.log(`Hello, Star-Resonance`);

};

init();
