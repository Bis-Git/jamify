import { useEffect, useState } from "react";
import { mediaInputService } from "../../../app/services/MediaInputService";
import styles from "./ControlSection.module.scss";

const ControlsSection = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("default");
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [isStartButton, setIsStartButton] = useState(false);

  useEffect(() => {
    mediaInputService.getAudioDevices().then((data) => setAudioDevices(data));
    return () => {
      mediaInputService.disconnectDevice();
    };
  }, []);

  const handleResume = async () => {
    await mediaInputService.actx.resume();
    setIsStartButton(true);
  };

  const handleSuspend = async () => {
    await mediaInputService.actx.suspend();
    setIsStartButton(false);
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
    </div>
  );
};

export default ControlsSection;
