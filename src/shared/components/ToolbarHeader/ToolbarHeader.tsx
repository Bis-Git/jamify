import { useContext, useEffect, useState } from 'react';
import { mediaInputService } from '../../../app/services/MediaInputService';
import { AppAudioContext } from '../../context/AppAudioContext/AppAudioContext';
import ControlsSection from '../ControlsSection/ControlsSection';
import DistortionSection from '../DistortionSection/DistortionSection';
import FilterSection from '../FilterSection/FilterSection';
import styles from './ToolbarHeader.module.scss';

const ToolbarHeader = () => {
  const {
    actx,
    changeFilter,
    changeFilterType,
    distortionSettings,
    changeDistortion,
    filterSettings,
    selectedDeviceId,
    setSelectedDeviceId,
  } = useContext(AppAudioContext);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLiveStartButton, setIsLiveStartButton] = useState(false);

  useEffect(() => {
    mediaInputService.getAudioDevices().then((data) => setAudioDevices(data));
    actx.suspend();
  }, []);

  const handleResume = async () => {
    await actx.resume();
    setIsLiveStartButton(true);
  };

  const handleSuspend = async () => {
    await actx.suspend();
    setIsLiveStartButton(false);
  };

  return (
    <div className={styles.container}>
      <ControlsSection
        audioDevices={audioDevices}
        handleResume={handleResume}
        handleSuspend={handleSuspend}
        isStartButton={isLiveStartButton}
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
