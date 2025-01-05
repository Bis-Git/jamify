declare module "essentia.js" {
  export default class Essentia {
    // Add specific function types as needed for your usage.
    [key: string]: any;
    PitchYin(options: { signal: Float32Array; sampleRate: number }): {
      pitch: number;
      probability: number;
    };
  }
}
