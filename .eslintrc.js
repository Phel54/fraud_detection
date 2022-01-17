module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest:true
  },
  extends: [
    'eslint:reccommended',
    'plugin:@typescript-eslint/  recommended',    
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'import'
  ],
  rules: {
    'prettier/prettier':'error'
  },
  "settings": {
    "import/resolver": {
        "typescript": {
            "alwaysTryTypes": true,
            "project": "./tsconfig.json"
        }
    }
}
};
