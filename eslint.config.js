// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import StylisticPlugin from "@stylistic/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";

const customizedStylistic = StylisticPlugin.configs.customize({
    indent: 4,
    semi: true,
    jsx: true,
    braceStyle: "1tbs",
    quoteProps: "consistent",
    quotes: "double",
});

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    StylisticPlugin.configs["disable-legacy"],
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat["jsx-runtime"],
    jsxA11y.flatConfigs.recommended,
    {
        plugins: {
            "react": reactPlugin,
            // @ts-expect-error wait for type fixes
            "react-hooks": fixupPluginRules(reactHooksPlugin),
            "@stylistic": StylisticPlugin,
        },
        rules: {
            ...customizedStylistic.rules,
            "react/prop-types": 0,
            "react-hooks/rules-of-hooks": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "@stylistic/jsx-one-expression-per-line": 0,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        languageOptions: {
            parserOptions: {
                project: true,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },

    {
        files: ["**/*.js"],
        ...tseslint.configs.disableTypeChecked,
    },
);
