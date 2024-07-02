import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    react(),
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
      },
    ],
  ],
});
