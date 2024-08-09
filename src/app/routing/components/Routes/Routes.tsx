import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../../../../App";
import { AuthRoute } from "../../enums/AuthRoute.enum";
import Dashboard from "../../../dashboard/Dashboard";

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path={AuthRoute.dashboard} element={<Dashboard />} />
    </Route>
  )
);

export default AppRouter;
