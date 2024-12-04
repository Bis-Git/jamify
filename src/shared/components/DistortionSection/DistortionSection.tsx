import { DistortionSettings } from "../../context/AppAudioContext/AppAudioContext";
import RangeKnob from "../RangeKnob/RangeKnob";
import styles from "./DistortionSection.module.scss";

interface DistortionSectionProps {
  distortionSettings: DistortionSettings;
  changeDistortion: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DistortionSection = ({
  distortionSettings,
  changeDistortion,
}: DistortionSectionProps) => {
  return (
    <div className={styles.container}>
      <RangeKnob
        name="Distortion"
        value={distortionSettings.curveAmount}
        onChange={changeDistortion}
      />
    </div>
  );
};

export default DistortionSection;
