import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../../../../App";
import { AuthRoute } from "../../enums/AuthRoute.enum";
import DashboardTest from "../../../dashboardTest/DashboardTest";

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path={AuthRoute.dashboard} element={<DashboardTest />} />
    </Route>
  )
);

export default AppRouter;
