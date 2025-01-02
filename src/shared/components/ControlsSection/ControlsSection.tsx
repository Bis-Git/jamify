import { Dispatch, SetStateAction, useContext } from 'react';
import { AppAudioContext } from '../../context/AppAudioContext/AppAudioContext';
import { useOscillator } from '../../hooks/useOscillator';
import styles from './ControlSection.module.scss';

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
  const { actx } = useContext(AppAudioContext);
  const { pulseOscillator } = useOscillator({ audioContext: actx });

  return (
    <div className={styles.container}>
      <div>
        <button onClick={isStartButton ? handleSuspend : handleResume}>
          {isStartButton ? 'Stop' : 'Start'}
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
        <button onClick={pulseOscillator}>Pulse</button>
      </div>
    </div>
  );
};

export default ControlsSection;
