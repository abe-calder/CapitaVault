import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
// // @ts-ignore module

const config = [
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser }, parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  }, },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];

export default config;
