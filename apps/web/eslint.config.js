import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      boundaries,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { mode: "full", type: "core", pattern: "src/core/**/*" },
        { mode: "full", type: "rendering", pattern: "src/rendering/**/*" },
        { mode: "full", type: "flight", pattern: "src/flight/**/*" },
        { mode: "full", type: "terrain", pattern: "src/terrain/**/*" },
        { mode: "full", type: "procedural", pattern: "src/procedural/**/*" },
        { mode: "full", type: "world", pattern: "src/world/**/*" },
        { mode: "full", type: "shaders", pattern: "src/shaders/**/*" },
        { mode: "full", type: "ui", pattern: "src/ui/**/*" },
        { mode: "full", type: "audio", pattern: "src/audio/**/*" },
        { mode: "full", type: "input", pattern: "src/input/**/*" },
        { mode: "full", type: "hooks", pattern: "src/hooks/**/*" },
        { mode: "full", type: "utils", pattern: "src/utils/**/*" },
      ],
    },
    rules: {
      // Warn on unknown elements (files not matching any type).
      // Error could block legitimate imports from external packages.
      "boundaries/no-unknown": "warn",
      "boundaries/no-ignored": "warn",
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          rules: [
            // Forbidden cross-subsystem imports.
            // Flight must not depend on terrain, procedural, or world.
            {
              from: { type: "flight" },
              disallow: { to: { type: ["terrain", "procedural", "world"] } },
            },
            // Rendering must not depend on flight or terrain logic.
            {
              from: { type: "rendering" },
              disallow: { to: { type: ["flight", "terrain"] } },
            },
            // Terrain must not depend on flight, ui, or audio.
            {
              from: { type: "terrain" },
              disallow: { to: { type: ["flight", "ui", "audio"] } },
            },
            // Procedural must not depend on rendering internals.
            {
              from: { type: "procedural" },
              disallow: { to: { type: "rendering" } },
            },
            // Shaders must not depend on rendering, flight, or terrain.
            {
              from: { type: "shaders" },
              disallow: { to: { type: ["rendering", "flight", "terrain"] } },
            },
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
]);
