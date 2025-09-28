// Tailwind stylesheet
import "@/css/tailwind.scss";
// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Your stylesheet
import "@/css/app.scss";
// React core
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
// Expose app configuration
import appConfig from "../app-config.json";

// Router
import router from "@/router";

if (!window.APP_CONFIG) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.APP_CONFIG = appConfig as any;
}

const root = createRoot(document.querySelector("#app")!);
root.render(React.createElement(RouterProvider, { router }));
