import React from "react";
import { DistortionSettings } from "../../context/AppAudioContext/AppAudioContext";
import RangeKnob from "../RangeKnob/RangeKnob";

interface DistortionSectionProps {
  settings: DistortionSettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DistortionSection = ({ settings, onChange }: DistortionSectionProps) => {
  const { curveAmount } = settings;

  return (
    <RangeKnob name="Distortion" value={curveAmount} onChange={onChange} />
  );
};

export default DistortionSection;
