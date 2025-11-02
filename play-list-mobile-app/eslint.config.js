import expoConfig from "eslint-config-expo/flat.js";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...expoConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
];
