/** @type {import('ts-jest').JestConfigWithTsJest} **/
/* @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testEnvironment: 'jsdom',
transform: {
'\\.[jt]sx?$': 'esbuild-jest',
},
};