import { createContext, PropsWithChildren, useState } from "react";
import { mediaInputService } from "../../../app/services/MediaInputService";

export interface FilterSettings {
  frequency: number;
  detune: number;
  Q: number;
  gain: number;
  type: BiquadFilterType;
}

export type DistortionSettings = {
  curveAmount: number;
};

interface AppAudioContextProps {
  filterSettings: FilterSettings;
  distortionSettings: DistortionSettings;
  changeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeFilterType: (type: BiquadFilterType) => void;
  changeDistortion: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AppAudioContext = createContext<AppAudioContextProps>({
  filterSettings: {
    frequency: 0,
    detune: 0,
    Q: 0,
    gain: 0,
    type: "lowpass",
  },
  distortionSettings: {
    curveAmount: 0,
  },
  changeFilter: () => null,
  changeFilterType: () => null,
  changeDistortion: () => null,
});

export const AppAudioProvider = ({ children }: PropsWithChildren) => {
  const [filterSettings, setFilterSettings] = useState({
    frequency: mediaInputService.filter?.frequency.value,
    detune: mediaInputService.filter?.detune.value,
    gain: mediaInputService.filter?.gain.value,
    Q: mediaInputService.filter?.Q.value,
    type: mediaInputService.filter?.type,
  });
  const [distortionSettings, setDistortionSettings] = useState({
    curveAmount: 0,
  });

  const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setFilterSettings({ ...filterSettings, [id]: value });
    (mediaInputService.filter as any)[id].value = value;
  };

  const changeFilterType = (type: BiquadFilterType) => {
    mediaInputService.filter.type = type;
    setFilterSettings({ ...filterSettings, type: type });
  };

  const changeDistortion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDistortionSettings((prev) => ({
      ...prev,
      curveAmount: parseInt(value),
    }));

    mediaInputService.distortion.curve = mediaInputService.makeDistortionCurve(
      parseInt(value)
    );
  };

  return (
    <AppAudioContext.Provider
      value={{
        changeFilter,
        filterSettings,
        distortionSettings,
        changeFilterType,
        changeDistortion,
      }}
    >
      {children}
    </AppAudioContext.Provider>
  );
};
