import { useContext, useState } from "react";
import { cMajorOptions } from "../constants/cMajorOptions";
import { AppAudioContext } from "../context/AppAudioContext/AppAudioContext";

export const useOscillator = () => {
  const { actx, masterGainNode } = useContext(AppAudioContext);

  const [pulseTonesConfig] = useState([
    {
      volume: 1,
      offset: 0,
    },
    {
      volume: 0.2,
      offset: 7,
    },
  ]);

  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomNote = () =>
    cMajorOptions[getRandomInt(0, cMajorOptions.length - 1)].value;

  const createNote = () => {
    if (!masterGainNode) return;

    const masterVca = actx.createGain();
    const vcos: OscillatorNode[] = [];

    pulseTonesConfig.forEach((config) => {
      const vco = actx.createOscillator();
      vco.frequency.value = transpose(getRandomNote(), config.offset);
      const vca = actx.createGain();
      vca.gain.value = config.volume;
      vco.connect(vca);
      vca.connect(masterVca);
      vcos.push(vco);
    });

    masterVca.connect(masterGainNode);

    return { vco: vcos, gainNode: masterVca };
  };

  const startPulse = ({
    note,
    time,
  }: {
    note: { vco: OscillatorNode[]; gainNode: GainNode };
    time: number;
  }) => {
    note.vco.map((vco) => vco.start(time));
    note.gainNode.gain.exponentialRampToValueAtTime(1, time + 0.2);
  };

  const stopPulse = ({
    note,
    time,
  }: {
    note: { vco: OscillatorNode[]; gainNode: GainNode };
    time: number;
  }) => {
    note.gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.5);
    note.vco.map((vco) => vco.stop(time + 1));
  };

  const pulse = async () => {
    const time = actx.currentTime;
    const note = createNote();

    if (!note) return;
    if (actx.state === "suspended") await actx.resume();

    startPulse({ note, time });

    stopPulse({ note, time: time + 0.5 });
  };

  const transpose = (freq: number, steps: number) =>
    freq * Math.pow(2, steps / 12);

  return {
    pulse,
  };
};
