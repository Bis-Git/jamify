import React, { useContext } from "react";
import { useEssentia } from "../../shared/hooks/useEssentia";
import { useOscillatorInput } from "./hooks/useOscillatorInput";
import { useAudioRecorder } from "../../shared/hooks/useAudioRecorder";
import { analyzeRecording } from "../../shared/utils/featureExtractionUtils";
import { GlobalTransportContext } from "../../shared/context/GlobalTransportContext/GlobalTransportContext";

const DashboardTest = () => {
  const context = new AudioContext({
    sampleRate: 44100,
  });
  const essentia = useEssentia();
  const {
    features,
    midiNotes,
    interOnsetIntervals,
    rhythmicInfo,
    setFeatures,
    process,
  } = useContext(GlobalTransportContext);

  const { pulseTone, getTotalDuration, recordingStream } =
    useOscillatorInput(context);
  const { startRecording, stopRecoring } = useAudioRecorder(recordingStream);

  const handleClick = async () => {
    startRecording();
    await pulseTone();
    const duration = getTotalDuration();

    setTimeout(async () => {
      const audioBlob = await stopRecoring();
      const result = await analyzeRecording(audioBlob, context, essentia);
      setFeatures(result);
    }, duration * 1000 + 100);
  };

  return (
    <div>
      <div>
        <button onClick={handleClick}>Play sound</button>
      </div>
      <button onClick={() => console.log(essentia.algorithmNames)}>
        Show algorithms
      </button>
      <button onClick={() => console.log(features)}>
        Show extracted features
      </button>
      <button onClick={process}>Process MIDI</button>
      <button
        onClick={() =>
          console.log({ midiNotes, interOnsetIntervals, rhythmicInfo })
        }
      >
        Show MIDI
      </button>
    </div>
  );
};

export default DashboardTest;
