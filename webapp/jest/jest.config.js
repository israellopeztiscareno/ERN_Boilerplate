/** @type {import('jest').Config} */
module.exports = {
  rootDir: "../",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": ["babel-jest", { configFile: "./jest/babel.config.js" }],
  },
  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "<rootDir>/jest/no-op.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/public/"],
  setupFilesAfterEnv: ["<rootDir>/jest/setup.js"],
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "<rootDir>/src/webapp/**/*.tsx",
    "!<rootDir>/src/helpers/test-utils/**/*.tsx",
  ],
  globals: {
    __DEV__: true,
    __PROD__: false,
    __CLIENT__: true,
    __SERVER__: false,
    __TEST__: true,
  },
};
