import { useRef, useContext, useState, useEffect } from "react";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
// import styles from "./Timeline.module.scss";
import { WaveformSeek } from "../WaveformSeek/WaveformSeek";
import { WaveformDrawer } from "../WaveformDrawer/WaveformDrawer";

const Timeline = () => {
  const { mediaStream, actx } = useContext(AppAudioContext);
  const { isRecording, audioUrl, startRecording, stopRecording } =
    useAudioRecorder();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [recordedWidth, setRecordedWidth] = useState(0);

  const toggleRecorder = async () => {
    if (isRecording) {
      await actx.suspend();
      stopRecording();
    } else {
      await actx.resume();
      startRecording(mediaStream);
    }
  };

  const handleSeek = (time: number) => {
    if (!audioElementRef.current || !isFinite(duration)) {
      console.error("Invalid duration or audio element not ready.");
      return;
    }
    audioElementRef.current.currentTime = time;
    setCurrentTime(time);
  };

  useEffect(() => {
    if (!audioUrl) return;

    const fetchAndDecode = async () => {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      try {
        const audioBuffer = await actx.decodeAudioData(arrayBuffer);
        setDuration(audioBuffer.duration);
        console.log("Decoded duration:", audioBuffer.duration);
      } catch (error) {
        console.error("Error decoding audio data:", error);
      }
    };

    fetchAndDecode();

    const audio = audioElementRef.current;
    if (!audio) return;

    const updateCurrentTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, [actx, audioUrl]);

  const isSupported = () => {
    const audio = document.createElement("audio");
    return !!(
      audio.canPlayType &&
      audio.canPlayType("audio/webm; codecs=opus").replace(/no/, "")
    );
  };

  useEffect(() => {
    console.log("Audio format supported:", isSupported());
  }, []);

  return (
    <div style={{ paddingLeft: "4px" }}>
      <button onClick={toggleRecorder}>
        {`${isRecording ? "Stop" : "Start"} recording`}
      </button>
      {mediaStream && (
        <div
          style={{
            position: "relative",
            width: "1400px",
            height: "200px",
          }}
        >
          <WaveformDrawer
            stream={mediaStream}
            isRecording={isRecording}
            setRecordedWidth={setRecordedWidth}
          />
          {audioUrl && duration > 0 && (
            <WaveformSeek
              recordedWith={recordedWidth}
              duration={duration}
              onSeek={handleSeek}
              currentTime={currentTime}
            />
          )}
        </div>
      )}

      <div
        style={{
          width: `${recordedWidth}px`,
          height: "20px",
          backgroundColor: "white",
        }}
      />

      {audioUrl && <audio controls ref={audioElementRef} src={audioUrl} />}
    </div>
  );
};

export default Timeline;
