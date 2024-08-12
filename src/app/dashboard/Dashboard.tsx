import { useEffect, useState } from "react";
import { mediaInputService } from "../services/MediaInputService";

const Dashboard = () => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  useEffect(() => {
    mediaInputService.getAudioDevices().then((data) => setAudioDevices(data));
  }, []);

  useEffect(() => {
    mediaInputService.disconnectDevice();
    mediaInputService.handleMediaStream(selectedDeviceId);
  }, [selectedDeviceId]);

  return (
    <div>
      <p>DASHBOARD</p>
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

export default Dashboard;
