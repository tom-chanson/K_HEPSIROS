import ReactDOM from "react-dom/client";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./styles/main.less";

import Calendar from "./components/calendar";
// import SidebarSettings from "./components/setting/sidebar";

import React from "react";
import { registerSW } from "virtual:pwa-register";
import SettingsPage from "./components/setting/setting";

if (!window.__TAURI_INTERNALS__ && import.meta.env.PROD) {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm("Une nouvelle version est disponible, voulez-vous l'installer ?"))
        updateSW(true);
    },
    onOfflineReady() {
      console.log("offline ready");
    },
  });
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
    <Calendar />
    {/* <SettingsPage /> */}
    </>,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
]);

document.body.classList.add("dark");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// reportWebVitals(console.log);