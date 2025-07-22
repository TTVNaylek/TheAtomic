import stylistic from "@stylistic/eslint-plugin";
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import { config } from "typescript-eslint";


export default config([
    {
        files: ["**/*.{ts,mts,cts}"],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaVersion: 'latest',
            }
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            "@stylistic": stylistic
        },
        rules: {
            "@stylistic/block-spacing": ["off"],
            '@stylistic/brace-style': ["error", "1tbs", {"allowSingleLine": true}],
            '@stylistic/indent': ["error", 4],
            "@stylistic/multiline-ternary": ["off"],
            "@stylistic/no-trailing-spaces": ["error", {"skipBlankLines": true}],
            "@stylistic/object-curly-spacing": ["error", "never"],
            '@stylistic/quotes': ["off"],
            '@stylistic/semi': ["error", "always"],
            "@stylistic/spaced-comment": ["off"],
            "@stylistic/space-infix-ops": ["error"],
            "@stylistic/space-before-blocks": ["error"],
            "@stylistic/arrow-spacing": ["error"],
            "@stylistic/keyword-spacing": ["error"],
        }
    }
]);
