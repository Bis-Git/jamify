import { useEffect, useRef } from "react";
import { cMajorScale } from "../constants/cMajorOptions";
import * as Tone from "tone";

export const useOscillatorInput = (actx: AudioContext) => {
  const sequence = [
    cMajorScale.C4,
    cMajorScale.D4,
    cMajorScale.E4,
    cMajorScale.F4,
    cMajorScale.G4,
    cMajorScale.A4,
    cMajorScale.B4,
    cMajorScale.C5,
    cMajorScale.B4,
    cMajorScale.A4,
    cMajorScale.G4,
    cMajorScale.F4,
    cMajorScale.E4,
    cMajorScale.D4,
    cMajorScale.C4,
  ];

  const durations = [
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
  ];

  const masterGainNode = actx.createGain();
  masterGainNode.connect(actx.destination);

  const recordingDestination = actx.createMediaStreamDestination();
  masterGainNode.connect(recordingDestination);

  const synthRef = useRef<Tone.PolySynth<Tone.Synth> | null>(null);

  useEffect(() => {
    Tone.setContext(actx);
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 1.0,
        release: 0.1,
      },
    });

    synthRef.current.connect(masterGainNode);

    return () => {
      if (synthRef.current) {
        synthRef.current.disconnect();
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, [actx]);

  const pulseTone = async () => {
    if (!synthRef.current) {
      console.error("Synth not initialized yet");
      return;
    }

    await Tone.start();

    const preDelay = 0.5;

    const n = Tone.now() + preDelay;

    const frequencyCheck: string[] = [];

    sequence.forEach((noteData, index) => {
      const startTime =
        n +
        sequence.slice(0, index).reduce((sum, _, i) => sum + durations[i], 0);
      const duration = durations[index];

      frequencyCheck.push(
        `Note ${index}: ${noteData.value} Hz -> ${Tone.Frequency(
          noteData.value,
          "hz"
        ).toNote()}`
      );

      synthRef.current!.triggerAttackRelease(
        Tone.Frequency(noteData.value, "hz").toNote(),
        duration,
        startTime
      );
    });

    console.log("Frequency check: ", frequencyCheck);
  };

  const getTotalDuration = () =>
    0.5 + durations.reduce((sum, d) => sum + d, 0) + 1.0;

  return {
    pulseTone,
    recordingStream: recordingDestination.stream,
    getTotalDuration,
  };
};
