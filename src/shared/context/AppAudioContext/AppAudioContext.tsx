import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { mediaInputService } from "../../../app/services/MediaInputService";
import { audioContextOptions } from "../../constants/audioContextOptions";
import { useDistortionEffect } from "../../hooks/useDistortionEffect";
import { useFilterEffect } from "../../hooks/useFilterEffect";
import { DistortionEffectSettings } from "../../models/DistortionEffectSettings";
import { chainEffects } from "../../utils/chainEffects";

export interface FilterSettings {
  frequency: number;
  detune: number;
  Q: number;
  gain: number;
  type: BiquadFilterType;
}

interface AppAudioContextProps {
  actx: AudioContext;
  masterGainNode: GainNode | undefined;
  filterSettings: FilterSettings;
  distortionSettings: DistortionEffectSettings;
  selectedDeviceId: string;
  mediaStream: MediaStream | null;
  processedStream: MediaStream | null;
  audioElementRef: React.MutableRefObject<HTMLAudioElement | null>;
  isRecording: boolean;
  audioUrl: string | null;
  currentTime: number;
  duration: number;
  recordedWidth: number;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setDuration: Dispatch<SetStateAction<number>>;
  setRecordedWidth: Dispatch<SetStateAction<number>>;
  changeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeFilterType: (type: BiquadFilterType) => void;
  changeDistortion: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string>>;
  handlePlay: VoidFunction;
  handlePause: VoidFunction;
  handleStop: VoidFunction;
  toggleRecorder: VoidFunction;
}

export const AppAudioContext = createContext<AppAudioContextProps>({
  actx: new AudioContext({ ...audioContextOptions }),
  masterGainNode: undefined,
  filterSettings: {
    frequency: 0,
    detune: 0,
    Q: 0,
    gain: 0,
    type: "lowpass",
  },
  distortionSettings: {
    curveAmount: 0,
    oversample: "none",
  },
  selectedDeviceId: "default",
  mediaStream: null,
  processedStream: null,
  audioElementRef: { current: null },
  isRecording: false,
  audioUrl: null,
  currentTime: 0,
  duration: 0,
  recordedWidth: 0,
  setCurrentTime: () => null,
  setDuration: () => null,
  setRecordedWidth: () => null,
  changeFilter: () => null,
  changeFilterType: () => null,
  changeDistortion: () => null,
  setSelectedDeviceId: () => null,
  handlePlay: () => null,
  handlePause: () => null,
  handleStop: () => null,
  toggleRecorder: () => null,
});

export const AppAudioProvider = ({ children }: PropsWithChildren) => {
  const actx = useMemo(() => new AudioContext({ ...audioContextOptions }), []);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("default");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [processedStream, setProcessedStream] = useState<MediaStream | null>(
    null
  );
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordedWidth, setRecordedWidth] = useState(0);

  const masterGainNode = useMemo(() => {
    const gainNode = actx.createGain();
    gainNode.gain.value = 1;
    gainNode.connect(actx.destination);
    return gainNode;
  }, []);

  const { distortionNode, distortionSettings, changeDistortion } =
    useDistortionEffect({
      audioContext: actx,
    });

  const { filterNode, filterSettings, changeFilter, changeFilterType } =
    useFilterEffect({
      audioContext: actx,
    });

  useEffect(() => {
    mediaInputService.handleMediaStream(selectedDeviceId).then((stream) => {
      if (!stream) return;
      setMediaStream(stream);

      actx.destination.disconnect();

      const destinationNode = chainEffects({
        audioContext: actx,
        mediaInput: stream,
        effects: [distortionNode, masterGainNode],
      });

      setProcessedStream(destinationNode.stream);
    });
  }, [actx, selectedDeviceId, distortionNode, filterNode, masterGainNode]);

  const startRecording = (stream: MediaStream | null) => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.ondataavailable = (event) =>
      audioChunksRef.current.push(event.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audioChunksRef.current = [];
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handlePlay = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const handleStop = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const toggleRecorder = async () => {
    console.log(isRecording, actx, processedStream, mediaRecorderRef.current);

    if (isRecording) {
      await actx.suspend();
      stopRecording();
    } else {
      handleStop();
      await actx.resume();
      startRecording(processedStream);
    }
  };

  useEffect(() => {
    console.log(selectedDeviceId);
  }, [selectedDeviceId]);

  return (
    <AppAudioContext.Provider
      value={{
        actx,
        masterGainNode,
        changeFilter,
        filterSettings,
        distortionSettings,
        selectedDeviceId,
        mediaStream,
        processedStream,
        audioElementRef,
        isRecording,
        audioUrl,
        currentTime,
        duration,
        recordedWidth,
        setCurrentTime,
        setDuration,
        setRecordedWidth,
        setSelectedDeviceId,
        changeFilterType,
        changeDistortion,
        handlePlay,
        handlePause,
        handleStop,
        toggleRecorder,
      }}
    >
      {children}
    </AppAudioContext.Provider>
  );
};
