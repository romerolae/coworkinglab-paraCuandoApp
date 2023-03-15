module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'ignorePatterns': [
    '/bin/cli.js',
    '/database/config/config.js',
    '/database/models/',
    'package.json',
    'package-lock.json',
  ],
  'rules': {
    'no-unused-vars': [
      'off', { 
        'vars': 'all', 
        'args': 'after-used',
        'ignoreRestSiblings': true 
      }],
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'any', 'prev': '*', 'next': '*' },
    ],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'off',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'off',
      'never'
    ]
  }
}
