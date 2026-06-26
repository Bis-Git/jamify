// types/essentia.d.ts

declare module "essentia.js/dist/essentia.js-core.es.js" {
  export default class Essentia {
    constructor(wasmModule: any);
    algorithmNames: string[];

    arrayToVector(inputArray: Float32Array): any;
    vectorToArray(inputVector: any): Float32Array;

    // Detects melody line/pitch
    PitchMelodia(
      signal: Float32Array,
      binResolution?: number,
      frameSize?: number,
      hopSize?: number,
      sampleRate?: number
    ): { pitch: number[]; pitchConfidence: number[] };

    PitchYinFFT(
      spectrum: Float32Array,
      frameSize?: number,
      interpolate?: boolean,
      maxFrequency?: number,
      minFrequency?: number,
      sampleRate?: number,
      tolerance?: number
    ): { pitch: number[]; pitchConfidence: number[] };

    // Detects musical key and scale
    KeyExtractor(
      audio: Float32Array,
      frameSize?: number,
      hopSize?: number,
      sampleRate?: number
    ): { key: string; scale: string; strength: number };

    // Detects BPM and beat positions/tempo & rhythm
    RhythmExtractor2013(
      signal: Float32Array,
      maxTempo?: number,
      method?: string,
      minTempo?: number
    ): {
      bpm: number;
      ticks: number[];
      confidence: number;
      estimates: number[];
      bpmIntervals: number[];
    };

    // Detects note start times/onsets
    OnsetRate(signal: Float32Array): { onsets: number[]; onsetRate: number };
  }
}

declare module "essentia.js/dist/essentia-wasm.es.js" {
  export const EssentiaWASM: any;
}
