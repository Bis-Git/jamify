import { useEffect, useState } from "react";
import { EffectBase } from "../models/EffectBase";
import { FilterEffectSettings } from "../models/FilterEffectSettings";

type UseFilterEffectProps = EffectBase;

export const useFilterEffect = ({ audioContext }: UseFilterEffectProps) => {
  const [filterNode, setFilterNode] = useState<BiquadFilterNode | null>(null);
  const [filterSettings, setFilterSettings] = useState<FilterEffectSettings>({
    frequency: 440,
    detune: 0,
    gain: 0,
    Q: 1,
    type: "lowpass",
  });

  useEffect(() => {
    const filter = audioContext.createBiquadFilter();
    filter.frequency.setValueAtTime(
      filterSettings.frequency,
      audioContext.currentTime
    );
    filter.detune.setValueAtTime(
      filterSettings.detune,
      audioContext.currentTime
    );
    filter.Q.setValueAtTime(filterSettings.Q, audioContext.currentTime);
    filter.gain.setValueAtTime(filterSettings.gain, audioContext.currentTime);
    filter.type = filterSettings.type;

    setFilterNode(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioContext]);

  const changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setFilterSettings({ ...filterSettings, [id]: value });
    (filterNode as any)[id].value = value;
  };

  const changeFilterType = (type: BiquadFilterType) => {
    if (!filterNode) return;
    setFilterSettings({ ...filterSettings, type: type });
    filterNode.type = type;
  };

  return { filterNode, filterSettings, changeFilter, changeFilterType };
};
