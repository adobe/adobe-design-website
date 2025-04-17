import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
    globalIgnores([
      ".config/*",
      "node_modules/*",
      "helix-importer-ui",
      "scripts/*",
      "eslint.config.mjs",
    ]),
    {
      files: ["**/*.{js}"],
    },
    {
      extends: [
          js.configs.recommended,
          importPlugin.flatConfigs.recommended,
        ]
    },
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.jest,
          ...globals.node,
          page: "readonly",
        },
        parser: babelParser,
        sourceType: "module",
        parserOptions: {
            ecmaVersion: 6,
            allowImportExportEverywhere: true,
            requireConfigFile: false,
        },
      },
    },
    {
      rules: {
        "import/extensions": ["error", {
            js: "always",
        }],
        "linebreak-style": ["error", "unix"],
        "no-param-reassign": [2, {
            props: false,
        }],
        "no-console": "error",
        "no-use-before-define": 1,
        "max-len": 0,
        "eol-last": ["error", "always"]
      },
    },
    {
      files: ["**/*.test.js"],
      rules: {
        "no-console": ["warn", { allow: ["log", "warn", "error"] }],
      },
    },
]);
