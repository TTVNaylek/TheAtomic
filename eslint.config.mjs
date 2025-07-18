import stylistic from "@stylistic/eslint-plugin";
import {config} from "typescript-eslint";
import parser from '@typescript-eslint/parser';


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
        }
    }
]);
