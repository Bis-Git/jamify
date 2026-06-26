import TestEssentia from "../../shared/components/TestEssentia/TestEssentia";
import Timeline from "../../shared/components/Timeline/Timeline";
import ToolbarHeader from "../../shared/components/ToolbarHeader/ToolbarHeader";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <ToolbarHeader />
      <TestEssentia />
      {/* <div className={styles.content}>
        <InstrumentList />
      </div> */}
      <Timeline />
    </div>
  );
};

export default Dashboard;
