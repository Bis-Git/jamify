class MediaInputService {
  public mediaStream: MediaStream | undefined;

  private getAllDevices = async () => {
    const devices = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => devices);
    return devices;
  };

  getAudioDevices = async () => {
    const devices = await this.getAllDevices();
    const audioDevices = devices.filter(
      (devices) => devices.kind === "audioinput"
    );

    return audioDevices;
  };

  handleMediaStream = async (deviceId: string) => {
    return await navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId,
          autoGainControl: false,
          noiseSuppression: false,
          echoCancellation: false,
          channelCount: 2,
          sampleRate: 44100,
        },
      })
      .then((stream) => stream)
      .catch((error) => {
        console.error(error);
        return undefined;
      });
  };
}

export const mediaInputService = new MediaInputService();
