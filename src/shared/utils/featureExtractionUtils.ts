import Essentia from "essentia.js/dist/essentia.js-core.es.js";
import { convertToMono } from "./convertToMono";

export type ExtractedFeatures = {
  sampleRate: number;
  duration: number;
  samples: number;
  channels: number;
  keyExtractor: {
    key: string;
    scale: string;
    strength: number;
  };
  rhythmExtractor: {
    bpm: number;
    bpmIntervals: Float32Array<ArrayBufferLike>;
    confidence: number;
    estimates: Float32Array<ArrayBufferLike>;
    ticks: Float32Array<ArrayBufferLike>;
  };
  onsetRate: {
    onsetRate: number;
    onsets: Float32Array<ArrayBufferLike>;
  };
  pitch: {
    pitch: Float32Array<ArrayBufferLike>;
    pitchConfidence: Float32Array<ArrayBufferLike>;
  };
};

export const downloadJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const calculateStats = (results: any[]) => {
  const bpms = results.map((r) => r.rhythmExtractor.bpm);
  const confidences = results.map((r) => r.rhythmExtractor.confidence);
  const strengths = results.map((r) => r.keyExtractor.strength);

  const keys = results.reduce((acc, r) => {
    const keyScale = `${r.keyExtractor.key} ${r.keyExtractor.scale}`;
    acc[keyScale] = (acc[keyScale] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    bpm: {
      min: Math.min(...bpms),
      max: Math.max(...bpms),
      avg: bpms.reduce((a, b) => a + b, 0) / bpms.length,
      stdDev: calculateStdDev(bpms),
    },
    confidence: {
      min: Math.min(...confidences),
      max: Math.max(...confidences),
      avg: confidences.reduce((a, b) => a + b, 0) / confidences.length,
    },
    keyStrength: {
      min: Math.min(...strengths),
      max: Math.max(...strengths),
      avg: strengths.reduce((a, b) => a + b, 0) / strengths.length,
    },
    keyDistribution: keys,
    mostCommonKey: Object.entries(keys).sort(
      (a, b) => (b[1] as number) - (a[1] as number)
    )[0],
  };
};

const calculateStdDev = (values: number[]) => {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

export const analyzeRecording = async (
  audioBlob: Blob,
  context: AudioContext,
  essentia: Essentia
): Promise<ExtractedFeatures | undefined> => {
  if (!essentia) return;

  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    const audioData = convertToMono(audioBuffer);
    const vectorAudio = essentia.arrayToVector(audioData);

    const keyExtractor = essentia.KeyExtractor(vectorAudio);
    const rhythmExtractor = essentia.RhythmExtractor2013(vectorAudio);
    const onsetRate = essentia.OnsetRate(vectorAudio);

    const pitch = essentia.PitchMelodia(vectorAudio);

    return {
      sampleRate: audioBuffer.sampleRate,
      duration: audioBuffer.duration,
      samples: audioData.length,
      channels: audioBuffer.numberOfChannels,
      keyExtractor,
      rhythmExtractor: {
        bpm: rhythmExtractor.bpm,
        bpmIntervals: essentia.vectorToArray(rhythmExtractor.bpmIntervals),
        confidence: rhythmExtractor.confidence,
        estimates: essentia.vectorToArray(rhythmExtractor.estimates),
        ticks: essentia.vectorToArray(rhythmExtractor.ticks),
      },
      onsetRate: {
        onsetRate: onsetRate.onsetRate,
        onsets: essentia.vectorToArray(onsetRate.onsets),
      },
      pitch: {
        pitch: essentia.vectorToArray(pitch.pitch),
        pitchConfidence: essentia.vectorToArray(pitch.pitchConfidence),
      },
    };
  } catch (error) {
    console.error("Failed to analyze recording: ", error);
  }
};
