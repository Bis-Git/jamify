import { useEffect, useState } from "react";
import { EffectBase } from "../models/EffectBase";
import { DistortionEffectSettings } from "../models/DistortionEffectSettings";

type UseDistortionEffectProps = EffectBase;

export const useDistortionEffect = ({
  audioContext,
}: UseDistortionEffectProps) => {
  const [distortionNode, setDistortionNode] = useState<WaveShaperNode | null>(
    null
  );
  const [distortionSettings, setDistortionSettings] =
    useState<DistortionEffectSettings>({
      curveAmount: 0,
      oversample: "none",
    });

  useEffect(() => {
    const distortion = audioContext.createWaveShaper();
    distortion.curve = createDistortionCurve(distortionSettings.curveAmount);
    distortion.oversample = distortionSettings.oversample;
    setDistortionNode(distortion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioContext]);

  const changeDistortion = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!distortionNode) return;
    const { value } = e.target;
    setDistortionSettings((prev) => ({
      ...prev,
      curveAmount: parseInt(value),
    }));

    distortionNode.curve = createDistortionCurve(parseInt(value));
  };

  return { distortionNode, distortionSettings, changeDistortion };
};

export const createDistortionCurve = (amount: number) => {
  const n_samples = 256;
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
};
