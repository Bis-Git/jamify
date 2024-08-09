import { Outlet } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Jamify";
  }, []);

  return <Outlet />;
}

export default App;
