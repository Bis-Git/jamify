import RangeKnob from "../RangeKnob/RangeKnob";
import styles from "./FilterSection.module.scss";
import { FilterSettings } from "../../context/AppAudioContext/AppAudioContext";

const filterTypes: BiquadFilterType[] = [
  "lowpass",
  "highpass",
  "notch",
  "lowshelf",
  "highshelf",
];

interface FilterSectionProps {
  changeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeFilterType: (type: BiquadFilterType) => void;
  filterSettings: FilterSettings;
}

const FilterSection = ({
  changeFilter,
  changeFilterType,
  filterSettings,
}: FilterSectionProps) => {
  const { frequency, detune, Q, gain, type } = filterSettings;
  return (
    <div className={styles.container}>
      <div className={styles.settings}>
        <RangeKnob
          max={10000}
          name="frequency"
          value={frequency}
          onChange={changeFilter}
        />
        <RangeKnob name="detune" value={detune} onChange={changeFilter} />
        <RangeKnob
          max={10}
          step={0.1}
          name="Q"
          value={Q}
          onChange={changeFilter}
        />
        <RangeKnob
          max={10}
          step={0.1}
          name="gain"
          value={gain}
          onChange={changeFilter}
        />
      </div>
      <div className={styles.buttonTypeGroup}>
        {filterTypes.map((value) => (
          <button
            key={value}
            onClick={() => changeFilterType(value)}
            className={`${type === value && "active"}`}
          >
            {value.toLocaleUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;
