import React, { ChangeEventHandler } from "react";
import styles from "./RangeKnob.module.scss";

interface RangeKnobProps {
  name: string;
  value: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  max?: number;
  step?: number;
}

const RangeKnob = ({ value, name, max, step, onChange }: RangeKnobProps) => {
  return (
    <div className={styles.container}>
      <h3>{name}</h3>
      <input
        type="range"
        onChange={onChange}
        id={name.toLocaleLowerCase()}
        max={max}
        step={step}
        value={value}
      />
    </div>
  );
};

export default RangeKnob;
