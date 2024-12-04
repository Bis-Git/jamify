import { Dispatch, SetStateAction } from "react";
import styles from "./ControlSection.module.scss";

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
    </div>
  );
};

export default ControlsSection;
