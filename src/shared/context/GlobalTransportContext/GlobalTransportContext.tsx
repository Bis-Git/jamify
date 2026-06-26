import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { ExtractedFeatures } from "../../utils/featureExtractionUtils";

const PITCH_CONFIDENCE_THRESHOLD = 0.3;
const RHYTHMIC_INFO_DEFAULT_STATE = {
  barGrid: [],
  beatGrid: [],
  secondsPerBeat: 0,
  beatsPerBar: 0,
  quantizedOnsets: [],
  onsetBeatPositions: [],
  rhythmicDensity: 0,
};

type MIDINotes = {
  midi: number;
  time: number;
  confidence: number;
  duration: number;
};

type RhythmcInfo = {
  beatGrid: number[];
  barGrid: number[];
  secondsPerBeat: number;
  beatsPerBar: number;
  quantizedOnsets: number[];
  onsetBeatPositions: number[];
  rhythmicDensity: number;
};

interface GlobalTransportContextProps {
  features: ExtractedFeatures | undefined;
  midiNotes: MIDINotes[];
  interOnsetIntervals: number[];
  rhythmicInfo: RhythmcInfo;
  setFeatures: Dispatch<SetStateAction<ExtractedFeatures | undefined>>;
  process: VoidFunction;
}

export const GlobalTransportContext =
  createContext<GlobalTransportContextProps>({
    features: undefined,
    midiNotes: [],
    interOnsetIntervals: [],
    rhythmicInfo: RHYTHMIC_INFO_DEFAULT_STATE,
    setFeatures: () => undefined,
    process: () => null,
  });

export const GlobalTransportProvider = ({ children }: PropsWithChildren) => {
  const [features, setFeatures] = useState<ExtractedFeatures>();
  const [midiNotes, setMidiNotes] = useState<MIDINotes[]>([]);
  const [interOnsetIntervals, setInterOnsetIntervals] = useState<number[]>([]);
  const [rhythmicInfo, setRhythmicInfo] = useState<RhythmcInfo>(
    RHYTHMIC_INFO_DEFAULT_STATE
  );

  const processPitchValues = () => {
    if (!features) return;

    const validPitches = Array.from(features.pitch.pitch)
      .map((hz, i) => ({
        hz,
        confidence: features.pitch.pitchConfidence[i],
        time: (i / features.pitch.pitch.length) * features.duration,
      }))
      .filter((p) => p.confidence > PITCH_CONFIDENCE_THRESHOLD && p.hz > 0);

    const onsetTimes = Array.from(features.onsetRate.onsets);

    const midiNotes = onsetTimes.flatMap((onsetTime, i) => {
      const nearbyPitches = validPitches.filter(
        (p) => Math.abs(p.time - onsetTime) < 0.05
      );

      if (nearbyPitches.length === 0) return [];

      const bestPitch = nearbyPitches.reduce((best, current) =>
        current.confidence > best.confidence ? current : best
      );

      const nextOnsetTime = onsetTimes[i + 1] ?? features.duration;

      return [
        {
          midi: Math.round(12 * Math.log2(bestPitch.hz / 440) + 69),
          time: onsetTime,
          confidence: bestPitch.confidence,
          duration: nextOnsetTime - onsetTime,
        },
      ];
    });

    setMidiNotes(midiNotes);
  };

  const processIOI = async () => {
    if (!features) return;
    const onsetTimes = Array.from(features.onsetRate.onsets);

    const ioiValues = onsetTimes.slice(1).map((t, i) => t - onsetTimes[i]);

    setInterOnsetIntervals(ioiValues);
  };

  const quantizeToBeat = (onsetTime: number, beatGrid: number[]): number =>
    beatGrid.reduce((nearest, beat) =>
      Math.abs(beat - onsetTime) < Math.abs(nearest - onsetTime)
        ? beat
        : nearest
    );

  const processTicks = () => {
    if (!features) return;
    const beatGrid = Array.from(features.rhythmExtractor.ticks);
    const tempo = features.rhythmExtractor.bpm;
    const secondsPerBeat = 60 / tempo;
    const beatsPerBar = 4; // 4/4 signature
    const barGrid = beatGrid.filter((_, index) => index % beatsPerBar === 0);
    const onsetTimes = Array.from(features.onsetRate.onsets);
    const quantizedOnsets = onsetTimes.map((onset) =>
      quantizeToBeat(onset, beatGrid)
    );
    const onsetBeatPositions = quantizedOnsets.map((onset) =>
      beatGrid.findIndex((beat) => Math.abs(beat - onset) < 0.01)
    );
    const totlaBars = barGrid.length;
    const rhythmicDensity = onsetTimes.length / totlaBars;

    setRhythmicInfo({
      beatGrid,
      barGrid,
      secondsPerBeat,
      beatsPerBar,
      quantizedOnsets,
      onsetBeatPositions,
      rhythmicDensity,
    });
  };

  const process = () => {
    processPitchValues();
    processIOI();
    processTicks();
  };

  return (
    <GlobalTransportContext.Provider
      value={{
        features,
        midiNotes,
        interOnsetIntervals,
        rhythmicInfo,
        setFeatures,
        process,
      }}
    >
      {children}
    </GlobalTransportContext.Provider>
  );
};
