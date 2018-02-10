module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jasmine": true,
  },
  extends: "eslint:recommended",
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    "no-console": 0
  }
};