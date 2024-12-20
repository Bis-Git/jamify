import { EffectList } from "../models/EffectList";

interface ChainEffectsProps {
  audioContext: AudioContext;
  mediaStream: MediaStream;
  effects: EffectList;
}

export const chainEffects = ({
  audioContext,
  mediaStream,
  effects,
}: ChainEffectsProps) => {
  const mediaInputNode = audioContext.createMediaStreamSource(mediaStream);

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
