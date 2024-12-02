import styles from "./ToolbarHeader.module.scss";
import ControlsSection from "../ControlsSection/ControlsSection";
import DistortionSection from "../DistortionSection/DistortionSection";
import FilterSection from "../FilterSection/FilterSection";

const ToolbarHeader = () => {
  return (
    <div className={styles.container}>
      <ControlsSection />
      <FilterSection />
      <DistortionSection />
    </div>
  );
};

export default ToolbarHeader;
