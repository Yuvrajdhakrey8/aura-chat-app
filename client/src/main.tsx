import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./context/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <Toaster position="top-right" />
      <App />
    </SocketProvider>
  </StrictMode>
);
