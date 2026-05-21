import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import importX from "eslint-plugin-import-x";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      unicorn,
      import: importX,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "camelCase",
          ignore: ["eslint.config.js", "prisma.config.ts"],
        },
      ],
      "prettier/prettier": "error",
      "import/no-unresolved": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["src/domain/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@application/**", "@infrastructure/**", "@presentation/**"],
              message: "Domain layer must not depend on Application, Infrastructure or Presentation layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/application/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@infrastructure/**", "@presentation/**"],
              message: "Application layer must not depend on Infrastructure or Presentation layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@presentation/**"],
              message: "Infrastructure layer must not depend on Presentation layer.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/presentation/**/*"],
    ignores: ["src/presentation/server.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@infrastructure/**"],
              message: "Presentation layer subfolders must not depend on Infrastructure layer. Use Application or Domain layers instead.",
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["node_modules/", "dist/", "prisma/", "eslint.config.js", "prisma.config.ts"],
  },
);
