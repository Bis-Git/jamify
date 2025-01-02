import { cMajorOptions } from '../constants/cMajorOptions';
import { EffectBase } from '../models/EffectBase';

type UseOscillatorProps = EffectBase;

export const useOscillator = ({ audioContext }: UseOscillatorProps) => {
  const pulseOscillator = async () => {
    if (audioContext.state === 'suspended') await audioContext.resume();

    const masterGain = audioContext.createGain();

    const delay = audioContext.createDelay();
    delay.delayTime.value = 0.4;
    masterGain.gain.value = 0.8;
    const feedback = audioContext.createGain();
    feedback.gain.value = 0.3;

    const note = {
      vco1: audioContext.createOscillator(),
      vca1: audioContext.createGain(),
      // vco2: audioContext.createOscillator(),
      // vca2: audioContext.createGain(),
    };

    note.vco1.connect(note.vca1);
    note.vca1.connect(masterGain);
    note.vca1.connect(delay);

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);

    // const startingPitch = note.vco1.frequency.value;

    // note.vco2.frequency.value = transpose(startingPitch, 7);
    // note.vco2.connect(note.vca2);
    // note.vca2.connect(masterGain);

    masterGain.connect(audioContext.destination);

    const fequencyIndex = getRandomInt(0, cMajorOptions.length - 1);
    note.vco1.frequency.value = cMajorOptions[fequencyIndex].value;

    note.vca1.gain.exponentialRampToValueAtTime(
      1,
      audioContext.currentTime + 0.2
    );
    note.vca1.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.5
    );

    note.vco1.start();
  };

  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // const transpose = (freq: number, steps: number) =>
  //   freq * Math.pow(2, steps / 12);

  return {
    pulseOscillator,
  };
};
