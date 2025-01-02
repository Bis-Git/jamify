import { useEffect, useState } from 'react';
import { EffectBase } from '../models/EffectBase';

type UseDelayEffectProps = EffectBase;

export const useDelayEffect = ({ audioContext }: UseDelayEffectProps) => {
  const [delayNode, setDelayNode] = useState<DelayNode | null>(null);

  useEffect(() => {
    const delay = audioContext.createDelay();

    delay.delayTime.value = 0.4;

    setDelayNode(delay);
  }, [audioContext]);

  return { delayNode };
};
