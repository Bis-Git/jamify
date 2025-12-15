import { Dispatch, SetStateAction, useContext } from "react";
import { useOscillator } from "../../hooks/useOscillator";
import styles from "./ControlSection.module.scss";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";

interface ControlsSectionProps {
  isStartButton: boolean;
  handleSuspend: VoidFunction;
  handleResume: VoidFunction;
  selectedDeviceId: string;
  setSelectedDeviceId: Dispatch<SetStateAction<string>>;
  audioDevices: MediaDeviceInfo[];
}

const ControlsSection = ({
  audioDevices,
  handleResume,
  handleSuspend,
  isStartButton,
  selectedDeviceId,
  setSelectedDeviceId,
}: ControlsSectionProps) => {
  const { pulse } = useOscillator();
  const { toggleRecorder, isRecording, handlePlay, handlePause, handleStop } =
    useContext(AppAudioContext);

  const playNote = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "a") pulse();
  };

  return (
    <div className={styles.container}>
      <div>
        <button onClick={isStartButton ? handleSuspend : handleResume}>
          {isStartButton ? "Stop" : "Start"}
        </button>
      </div>

      <select
        value={selectedDeviceId}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
      >
        {audioDevices.map((device) => (
          <option key={device.deviceId} value={device?.deviceId}>
            {device.label}
          </option>
        ))}
      </select>

      <div>
        <button onKeyDown={playNote} onClick={pulse}>
          Pulse
        </button>
      </div>
      <div>
        <button onClick={toggleRecorder}>
          {`${isRecording ? "Stop" : "Start"} recording`}
        </button>
      </div>

      <div>
        <button onClick={handlePlay} disabled={isRecording}>
          Play
        </button>
        <button onClick={handlePause} disabled={isRecording}>
          Pause
        </button>
        <button onClick={handleStop} disabled={isRecording}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default ControlsSection;
