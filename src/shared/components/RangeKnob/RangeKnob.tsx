import React, { ChangeEventHandler } from "react";
import styles from "./RangeKnob.module.scss";

interface RangeKnobProps {
  name: string;
  value: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  max: number;
  step?: number;
}

const RangeKnob = ({ value, name, max, step, onChange }: RangeKnobProps) => {
  const rotation = (value / max) * 270 - 135;
  return (
    <div>
      <h3>{name.toLocaleUpperCase()}</h3>
      <div className={styles.container}>
        <div
          className={styles.knob}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className={styles.indicator}></div>
        </div>
        <input
          type="range"
          onChange={onChange}
          id={name}
          max={max}
          step={step}
          value={value}
        />
      </div>
    </div>
  );
};

export default RangeKnob;
