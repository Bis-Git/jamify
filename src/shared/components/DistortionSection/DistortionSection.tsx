import { useContext } from "react";
import RangeKnob from "../RangeKnob/RangeKnob";
import styles from "./DistortionSection.module.scss";
import { AppAudioContext } from "../../context/AppAudioContext/AppAudioContext";

const DistortionSection = () => {
  const { distortionSettings, changeDistortion } = useContext(AppAudioContext);

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
