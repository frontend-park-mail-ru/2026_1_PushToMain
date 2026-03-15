import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        ignores: ["public/*.js"],
        plugins: { js },
        extends: ["js/recommended"],

        languageOptions: {
            parserOptions: {
                project: true,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["public/*.js"],
        plugins: { "@typescript-eslint": tseslint.plugin },
        extends: [...tseslint.configs.recommended],

        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
        rules: {
            "css/no-invalid-properties": [
                "error",
                {
                    allowUnknownVariables: true,
                },
            ],
        },
    },
]);
