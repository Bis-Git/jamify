import styles from "./ToolbarHeader.module.scss";
import ControlsSection from "../ControlsSection/ControlsSection";
import DistortionSection from "../DistortionSection/DistortionSection";
import FilterSection from "../FilterSection/FilterSection";
import { useContext, useEffect, useState } from "react";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";
import { mediaInputService } from "../../../app/services/MediaInputService";

const ToolbarHeader = () => {
  const {
    changeFilter,
    changeFilterType,
    distortionSettings,
    changeDistortion,
    filterSettings,
  } = useContext(AppAudioContext);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("default");
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [isStartButton, setIsStartButton] = useState(false);

  useEffect(() => {
    mediaInputService.getAudioDevices().then((data) => setAudioDevices(data));
    return () => {
      mediaInputService.disconnectDevice();
    };
  }, []);

  useEffect(() => {
    mediaInputService.handleMediaStream(selectedDeviceId);
  }, [selectedDeviceId]);

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
      <ControlsSection
        audioDevices={audioDevices}
        handleResume={handleResume}
        handleSuspend={handleSuspend}
        isStartButton={isStartButton}
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
      />
      <FilterSection
        changeFilter={changeFilter}
        changeFilterType={changeFilterType}
        filterSettings={filterSettings}
      />
      <DistortionSection
        distortionSettings={distortionSettings}
        changeDistortion={changeDistortion}
      />
    </div>
  );
};

export default ToolbarHeader;
