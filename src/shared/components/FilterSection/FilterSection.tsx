import React from "react";
import RangeKnob from "../RangeKnob/RangeKnob";

interface FilterSectionProps {
  settings: {
    frequency: number;
    detune: number;
    Q: number;
    gain: number;
    type: BiquadFilterType;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeType: (type: BiquadFilterType) => void;
}

const filterTypes: BiquadFilterType[] = [
  "lowpass",
  "highpass",
  "notch",
  "lowshelf",
  "highshelf",
];

const FilterSection = ({
  settings,
  onChange,
  changeType,
}: FilterSectionProps) => {
  const { frequency, detune, Q, gain, type } = settings;
  return (
    <div className="control">
      <h2>Filter</h2>
      <div>
        <RangeKnob
          max={10000}
          name="Frequency"
          value={frequency}
          onChange={onChange}
        />
        <RangeKnob name="Detune" value={detune} onChange={onChange} />
        <RangeKnob max={10} step={0.1} name="Q" value={Q} onChange={onChange} />
        <RangeKnob
          max={10}
          step={0.1}
          name="Gain"
          value={gain}
          onChange={onChange}
        />
      </div>
      {filterTypes.map((value) => (
        <button
          key={value}
          onClick={() => changeType(value)}
          className={`${type === value && "active"}`}
        >
          {value.toLocaleUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default FilterSection;
