import { useContext } from "react";
import RangeKnob from "../RangeKnob/RangeKnob";
import styles from "./FilterSection.module.scss";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";

const filterTypes: BiquadFilterType[] = [
  "lowpass",
  "highpass",
  "notch",
  "lowshelf",
  "highshelf",
];

const FilterSection = () => {
  const { changeFilter, changeFilterType, filterSettings } =
    useContext(AppAudioContext);

  const { frequency, detune, Q, gain, type } = filterSettings;
  return (
    <div className={styles.container}>
      <div className={styles.settings}>
        <RangeKnob
          max={10000}
          name="Frequency"
          value={frequency}
          onChange={changeFilter}
        />
        <RangeKnob name="Detune" value={detune} onChange={changeFilter} />
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
          name="Gain"
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
