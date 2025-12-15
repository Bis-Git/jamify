import { EffectList } from "../models/EffectList";

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

  const destinationNode = audioContext.createMediaStreamDestination();
  previousNode.connect(destinationNode);

  return destinationNode;
};
