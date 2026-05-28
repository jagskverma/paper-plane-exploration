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
      boundaries: boundaries,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
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
        { mode: "full", type: "hooks", pattern: "src/hooks/**/*" },
        { mode: "full", type: "utils", pattern: "src/utils/**/*" },
        { mode: "full", type: "input", pattern: "src/input/**/*" },
        { mode: "full", type: "shared", pattern: ["src/hooks/**/*", "src/utils/**/*"] },
      ],
    },
    rules: {
      "boundaries/no-unknown": "error",
      "boundaries/no-ignored": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            // Shared can be imported by anyone
            {
              from: { type: "core" },
              allow: ["shared"],
            },
            {
              from: { type: "rendering" },
              allow: ["shared", "core"],
            },
            {
              from: { type: "flight" },
              allow: ["shared", "core", "input"],
            },
            {
              from: { type: "terrain" },
              allow: ["shared", "core", "procedural", "world"],
            },
            {
              from: { type: "procedural" },
              allow: ["shared", "core"],
            },
            {
              from: { type: "world" },
              allow: ["shared", "core"],
            },
            {
              from: { type: "shaders" },
              allow: ["shared"],
            },
            {
              from: { type: "ui" },
              allow: ["shared", "core"],
            },
            {
              from: { type: "audio" },
              allow: ["shared", "core"],
            },
            {
              from: { type: "input" },
              allow: ["shared", "core"],
            },
            {
              from: { type: "hooks" },
              allow: ["shared"],
            },
            {
              from: { type: "utils" },
              allow: ["shared"],
            },
            // Core bootstraps everything
            {
              from: { type: "core" },
              allow: ["rendering", "flight", "terrain", "procedural", "world", "shaders", "ui", "audio", "input", "shared"],
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
