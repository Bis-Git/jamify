import { useContext, useEffect } from "react";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";
// import styles from "./Timeline.module.scss";
import { WaveformSeek } from "../WaveformSeek/WaveformSeek";
import { WaveformDrawer } from "../WaveformDrawer/WaveformDrawer";

const Timeline = () => {
  const {
    processedStream,
    actx,
    audioElementRef,
    duration,
    setCurrentTime,
    audioUrl,
    setDuration,
    setRecordedWidth,
    recordedWidth,
    currentTime,
    isRecording,
  } = useContext(AppAudioContext);

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

  return (
    <div style={{ paddingLeft: "4px" }}>
      {audioUrl && <audio controls src={audioUrl} />}
      {/* {processedStream && (
        <div
          style={{
            position: "relative",
            width: "1400px",
            height: "200px",
          }}
        >
          <WaveformDrawer
            stream={processedStream}
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

      {audioUrl && <audio ref={audioElementRef} src={audioUrl} />} */}
    </div>
  );
};

export default Timeline;
