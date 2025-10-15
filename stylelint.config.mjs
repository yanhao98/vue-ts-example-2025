/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss',
  ],
  overrides: [
    {
      files: ['**/*.scss'],

      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // 允许非 kebab-case 的 ID（Vue 使用 __ID__ 约定）
    'selector-id-pattern': null,
    // >>>>>
    // 禁用默认的 at-rule-no-unknown，使用 SCSS 专用的规则
    // 'at-rule-no-unknown': null,
    // SCSS 专用的 at-rule 规则会自动处理 @include, @mixin 等
    // 'scss/at-rule-no-unknown': true,
    // <<<<<
  },
};
