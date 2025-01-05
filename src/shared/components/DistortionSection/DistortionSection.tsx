import { DistortionEffectSettings } from "../../models/DistortionEffectSettings";
import RangeKnob from "../RangeKnob/RangeKnob";
import styles from "./DistortionSection.module.scss";

interface DistortionSectionProps {
  distortionSettings: DistortionEffectSettings;
  changeDistortion: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DistortionSection = ({
  distortionSettings,
  changeDistortion,
}: DistortionSectionProps) => {
  return (
    <div className={styles.container}>
      <RangeKnob
        max={100}
        name="Distortion"
        value={distortionSettings.curveAmount}
        onChange={changeDistortion}
      />
    </div>
  );
};

export default DistortionSection;
