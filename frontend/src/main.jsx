import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Thêm Router cái đã
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
