import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { MapProvider } from "./context/MapContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <MapProvider>
          <App />
        </MapProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);