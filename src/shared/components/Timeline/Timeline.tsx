import { useRef, useContext } from "react";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import styles from "./Timeline.module.scss";
import { WaveformRecorder } from "../AudioVisualizer/AudioVisualizer";

const Timeline = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { mediaStream } = useContext(AppAudioContext);
  const { audioUrl, isRecording, startRecording, stopRecording } =
    useAudioRecorder();

  const toggleRecorder = () => {
    if (!mediaStream) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording(mediaStream);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <button onClick={toggleRecorder}>{`${
          isRecording ? "Stop" : "Start"
        } recorder`}</button>
      </div>
      {mediaStream && (
        <WaveformRecorder isRecording={isRecording} stream={mediaStream} />
      )}
      {audioUrl && (
        <>
          <audio ref={audioRef} controls src={audioUrl} />
        </>
      )}
    </div>
  );
};

export default Timeline;
