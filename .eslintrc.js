module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    indent: [2, 2],
    eqeqeq: 2,
    'no-bitwise': 2,
    'no-use-before-define': 2,
    strict: [2, 'global'],
    'dot-notation': 2,
    'space-infix-ops': 2,
    'max-len': [2, 220],
    'require-jsdoc': 0
  },
  globals: {
    process: true
  }
  // add your custom rules here
};
