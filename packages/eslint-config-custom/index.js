module.exports = {
  env: {
    es2020: true,
    node: true
  },
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    quotes: [
      "warn",
      "single",
      {
        "avoidEscape": true
      }
    ],
    semi: ["warn", "always"],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-misused-promises": "off",
  },
};