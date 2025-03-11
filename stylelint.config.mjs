export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-stylus"],
  rules: {
    "alpha-value-notation": null,
    "color-hex-length": "long",
    "declaration-block-no-redundant-longhand-properties": null,
    "declaration-empty-line-before": null,
    "function-linear-gradient-no-nonstandard-direction": null,
    "import-notation": null,
    "keyframes-name-pattern": null,
    "length-zero-no-unit": true,
    "media-feature-range-notation": null,
    "media-query-no-invalid": null,
    "number-max-precision": 4,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "selector-not-notation": null,
    "stylus/number-leading-zero": "always",
    "stylus/number-no-trailing-zeros": true,
    "unit-disallowed-list": ["s"],
    "value-keyword-case": null,
  }
};
