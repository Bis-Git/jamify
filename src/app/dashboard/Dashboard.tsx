import AudioVisualizer from "../../shared/components/AudioVisualizer/AudioVisualizer";
import InstrumentList from "../../shared/components/InstrumentList/InstrumentList";
import Timeline from "../../shared/components/Timeline/Timeline";
import ToolbarHeader from "../../shared/components/ToolbarHeader/ToolbarHeader";
import styles from "./Dashboard.module.scss";
import * as essentia from "essentia.js";

const Dashboard = () => {
  console.log(essentia);

  return (
    <div className={styles.container}>
      <ToolbarHeader />
      <div className={styles.content}>
        <InstrumentList />
        <AudioVisualizer />
      </div>
      <Timeline />
    </div>
  );
};

export default Dashboard;
