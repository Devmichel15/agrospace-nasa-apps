import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/hanken-grotesk";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { FarmProvider } from "./context/FarmContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FarmProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FarmProvider>
    </AuthProvider>
  </StrictMode>,
);
