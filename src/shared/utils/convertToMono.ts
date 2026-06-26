export const convertToMono = (audioBuffer: AudioBuffer): Float32Array => {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }

  const length = audioBuffer.length;
  const monoData = new Float32Array(length);

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      monoData[i] = channelData[i];
    }
  }

  for (let i = 0; i < length; i++) {
    monoData[i] /= audioBuffer.numberOfChannels;
  }

  return monoData;
};
