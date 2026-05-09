import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      unicorn,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "camelCase",
          ignore: ["eslint.config.js"],
        },
      ],
    },
  },
  {
    ignores: ["node_modules/", "dist/", "prisma/"],
  },
);
