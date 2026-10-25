
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

// Global Tailwind CSS v4 styles
import "./index.css";

// Shared styles for individual tool components
import "./App.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
