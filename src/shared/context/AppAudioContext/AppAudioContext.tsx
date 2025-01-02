import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { mediaInputService } from '../../../app/services/MediaInputService';
import { audioContextOptions } from '../../constants/audioContextOptions';
import { useDistortionEffect } from '../../hooks/useDistortionEffect';
import { useFilterEffect } from '../../hooks/useFilterEffect';
import { DistortionEffectSettings } from '../../models/DistortionEffectSettings';

export interface FilterSettings {
  frequency: number;
  detune: number;
  Q: number;
  gain: number;
  type: BiquadFilterType;
}

interface AppAudioContextProps {
  actx: AudioContext;
  filterSettings: FilterSettings;
  distortionSettings: DistortionEffectSettings;
  selectedDeviceId: string;
  changeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeFilterType: (type: BiquadFilterType) => void;
  changeDistortion: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string>>;
}

export const AppAudioContext = createContext<AppAudioContextProps>({
  actx: new AudioContext({ ...audioContextOptions }),
  filterSettings: {
    frequency: 0,
    detune: 0,
    Q: 0,
    gain: 0,
    type: 'lowpass',
  },
  distortionSettings: {
    curveAmount: 0,
    oversample: 'none',
  },
  selectedDeviceId: 'default',
  changeFilter: () => null,
  changeFilterType: () => null,
  changeDistortion: () => null,
  setSelectedDeviceId: () => null,
});

export const AppAudioProvider = ({ children }: PropsWithChildren) => {
  const actx = useMemo(() => new AudioContext({ ...audioContextOptions }), []);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');

  const { distortionNode, distortionSettings, changeDistortion } =
    useDistortionEffect({
      audioContext: actx,
    });

  const { filterNode, filterSettings, changeFilter, changeFilterType } =
    useFilterEffect({
      audioContext: actx,
    });

  useEffect(() => {
    mediaInputService.handleMediaStream(selectedDeviceId).then((stream) => {
      if (!stream) return;
      // actx.destination.disconnect();

      // chainEffects({
      //   audioContext: actx,
      //   mediaInput: stream,
      //   effects: [actx.createGain(), filterNode, distortionNode],
      // });
    });
  }, [actx, selectedDeviceId, distortionNode, filterNode]);

  return (
    <AppAudioContext.Provider
      value={{
        actx,
        changeFilter,
        filterSettings,
        distortionSettings,
        selectedDeviceId,
        setSelectedDeviceId,
        changeFilterType,
        changeDistortion,
      }}
    >
      {children}
    </AppAudioContext.Provider>
  );
};
