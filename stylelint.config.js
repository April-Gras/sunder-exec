module.exports = {
  extends: ["stylelint-config-recommended"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "layer",
          "apply",
          "variants",
          "responsive",
          "screen",
          "mixin",
          "include",
          "extend",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
  },
}