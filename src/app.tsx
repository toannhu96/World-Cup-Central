// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Tailwind stylesheet
import "./css/tailwind.scss";
// Your stylesheet
import "./css/app.scss";

// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Mount the app
import Layout from "./components/layout";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Expose app configuration
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

console.log("App mounting...");
try {
  const rootElement = document.getElementById("app");
  if (!rootElement) {
    console.error("Root element #app not found!");
  } else {
    const root = createRoot(rootElement);
    root.render(
      React.createElement(ErrorBoundary, {}, React.createElement(Layout))
    );
    console.log("App render called");
  }
} catch (error) {
  console.error("App mount failed:", error);
}
