/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "jsdom", //was node is veranderd naar jsdom
  transform: {
    "\\.[jt]sx?$": 'esbuild-jest',
  },
};