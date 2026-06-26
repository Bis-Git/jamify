import { useMemo } from "react";
import Essentia from "essentia.js/dist/essentia.js-core.es.js";
import { EssentiaWASM } from "essentia.js/dist/essentia-wasm.es.js";

let instance: Essentia | null = null;

export const useEssentia = () => {
  const essentia = useMemo(() => {
    if (!instance) {
      instance = new Essentia(EssentiaWASM);
    }
    return instance;
  }, []);

  return essentia;
};
