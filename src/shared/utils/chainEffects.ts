import { EffectList } from '../models/EffectList';

interface ChainEffectsProps {
  audioContext: AudioContext;
  mediaInput: MediaStream | OscillatorNode;
  effects: EffectList;
}

export const chainEffects = ({
  audioContext,
  mediaInput,
  effects,
}: ChainEffectsProps) => {
  const mediaInputNode =
    mediaInput instanceof MediaStream
      ? audioContext.createMediaStreamSource(mediaInput)
      : mediaInput;

  const enabledEffects = effects.filter(
    (effect) => effect !== null && effect !== undefined
  );

  let previousNode: AudioNode = mediaInputNode;

  enabledEffects.forEach((effect) => {
    previousNode.connect(effect);
    previousNode = effect;
  });

  if (enabledEffects.length > 0) {
    previousNode.connect(audioContext.destination);
  } else {
    mediaInputNode.connect(audioContext.destination);
  }
};
