module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jasmine": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  rules: {
    "no-console": 0,
    "semi": ["error", "never"],
    "no-multiple-empty-lines": ["error", { "max": 1}]
  }
};