import { audioContextOptions } from "../../shared/constants/audioContextOptions";

class MediaInputService {
  public actx: AudioContext = new AudioContext({ ...audioContextOptions });
  public mediaSource: MediaStreamAudioSourceNode | undefined;
  public gain: GainNode = this.actx.createGain();
  public filter: BiquadFilterNode = this.actx.createBiquadFilter();
  public distortion: WaveShaperNode = this.actx.createWaveShaper();

  public makeDistortionCurve = (amount: number) => {
    const n_samples = 256;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  };

  private connectDevice = (stream: MediaStream) => {
    this.mediaSource = this.actx.createMediaStreamSource(stream);

    this.mediaSource.connect(this.gain);
    this.gain.connect(this.filter);
    this.filter.connect(this.distortion);
    this.distortion.connect(this.actx.destination);
  };

  private getAllDevices = async () => {
    const devices = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => devices);
    return devices;
  };

  disconnectDevice = () => {
    this.mediaSource?.disconnect();
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
