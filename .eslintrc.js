module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
  },
  extends: "eslint:recommended",
  parser: 'babel-eslint',
  // plugins: [
  //   'babel'
  // ],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    "no-console": 0
  }
};