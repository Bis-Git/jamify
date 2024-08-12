class MediaInputService {
  private audioNode: MediaStreamAudioSourceNode | undefined;

  private connectDevice = (stream: MediaStream) => {
    const audioContext = new AudioContext({
      latencyHint: "interactive",
    });
    this.audioNode = audioContext.createMediaStreamSource(stream);

    this.audioNode.connect(audioContext.destination);
  };

  private getAllDevices = async () => {
    const devices = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => devices);
    return devices;
  };

  disconnectDevice = () => {
    this.audioNode?.disconnect();
  };

  getAudioDevices = async () => {
    const devices = await this.getAllDevices();
    const audioDevices = devices.filter(
      (devices) => devices.kind === "audioinput"
    );

    return audioDevices;
  };

  handleMediaStream = (deviceId: string) => {
    navigator.mediaDevices
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
      .then((stream) => this.connectDevice(stream))
      .catch((error) => console.error(error));
  };
}

export const mediaInputService = new MediaInputService();
