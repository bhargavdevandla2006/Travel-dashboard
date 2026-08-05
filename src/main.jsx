import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MapProvider } from "./context/MapContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <MapProvider>
        <App />
      </MapProvider>
    </ThemeProvider>
  </StrictMode>
);