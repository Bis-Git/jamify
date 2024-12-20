import { useEffect, useState } from "react";
import { EffectBase } from "../models/EffectBase";
import { DelayEffectSettings } from "../models/DelayEffectSettings";

type UseDelayEffectProps = {
  settings: DelayEffectSettings;
} & EffectBase;

export const useDelayEffect = ({
  audioContext,
  settings,
}: UseDelayEffectProps) => {
  const [delayNode, setDelayNode] = useState<DelayNode | null>(null);

  useEffect(() => {
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();
    const dryWetMix = audioContext.createGain();

    delay.delayTime.setValueAtTime(
      settings.delayTime,
      audioContext.currentTime
    );
    feedback.gain.setValueAtTime(settings.feedback, audioContext.currentTime);
    dryWetMix.gain.setValueAtTime(settings.dryWetMix, audioContext.currentTime);

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(dryWetMix);
    dryWetMix.connect(audioContext.destination);

    setDelayNode(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioContext]);

  return delayNode;
};
