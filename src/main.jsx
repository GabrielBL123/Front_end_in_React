import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import LoginPage from "./components/Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>
);
