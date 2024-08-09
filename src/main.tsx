import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SharedProviders from "./shared/components/SharedProviders/SharedProviders.tsx";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./app/routing/components/Routes/Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SharedProviders>
      <RouterProvider router={AppRouter} />
    </SharedProviders>
  </StrictMode>
);
