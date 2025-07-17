import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin"


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
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
