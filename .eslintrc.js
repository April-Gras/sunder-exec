module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    semi: [2, "never"],
    "no-console": "off",
    "prettier/prettier": ["error", { semi: false }],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "vue/no-v-html": 0,
    "import/named": 0,
    "vue/script-setup-uses-vars": 0,
  },
}
