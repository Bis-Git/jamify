import { useContext, useEffect, useState } from "react";
import { mediaInputService } from "../services/MediaInputService";
import FilterSection from "../../shared/components/FilterSection/FilterSection";
import { AppAudioContext } from "../../shared/context/AppAudioContext/AppAudioContext";
import DistortionSection from "../../shared/components/DistortionSection/DistortionSection";

const Dashboard = () => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("default");
  const [isStartButton, setIsStartButton] = useState(false);

  const {
    filterSettings,
    distortionSettings,
    changeDistortion,
    changeFilter,
    changeFilterType,
  } = useContext(AppAudioContext);

  useEffect(() => {
    mediaInputService.getAudioDevices().then((data) => setAudioDevices(data));
    return () => {
      mediaInputService.disconnectDevice();
    };
  }, []);

  useEffect(() => {
    mediaInputService.disconnectDevice();
    mediaInputService.handleMediaStream(selectedDeviceId);
  }, [selectedDeviceId]);

  const renderControlButtons = () => {
    if (isStartButton) {
      return (
        <button
          onClick={async () => {
            await mediaInputService.actx.suspend();
            setIsStartButton(false);
          }}
        >
          Stop
        </button>
      );
    } else {
      return (
        <button
          onClick={async () => {
            await mediaInputService.actx.resume();
            setIsStartButton(true);
          }}
        >
          Start
        </button>
      );
    }
  };

  return (
    <div>
      <div>{renderControlButtons()}</div>
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

      <div>
        <FilterSection
          settings={filterSettings}
          onChange={changeFilter}
          changeType={changeFilterType}
        />
        <DistortionSection
          settings={distortionSettings}
          onChange={changeDistortion}
        />
      </div>
    </div>
  );
};

export default Dashboard;
