export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    // https://github.com/kulshekhar/ts-jest/issues/1173#issuecomment-1404142039
    "^.+\\.(ts|tsx)?$": ["ts-jest", { diagnostics: { ignoreCodes: ["TS151001"] } }],
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};
