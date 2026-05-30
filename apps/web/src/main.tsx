import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useGLTF } from "@react-three/drei";
import { App } from "./core/App";

// Draco mesh compression support for compressed .glb assets
useGLTF.setDecoderPath("/draco/");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
