module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    __CLIENT__: false,
    __SERVER__: false,
    __DEV__: false,
    __PROD__: false,
    __TEST__: false,
  },
  plugins: [],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      presets: [["@babel/preset-react"]],
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": 0,
  },
  overrides: [
    {
      files: ["**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};
