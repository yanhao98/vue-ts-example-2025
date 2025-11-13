import vueI18n from '@intlify/eslint-plugin-vue-i18n';
// import stylistic from '@stylistic/eslint-plugin';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';
import pluginImport from 'eslint-plugin-import';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginOxlint from 'eslint-plugin-oxlint';
import pluginPlaywright from 'eslint-plugin-playwright';
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';
import jsoncParser from 'jsonc-eslint-parser';

configureVueProject({ scriptLangs: ['ts', 'tsx'] });
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['worker-configuration.d.ts', '**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
  ...pluginOxlint.configs['flat/recommended'],

  // https://eslint-plugin-vue-i18n.intlify.dev/started.html#getting-started
  ...vueI18n.configs.recommended,
  {
    rules: {
      '@intlify/vue-i18n/no-raw-text': 'off',
    },
    settings: {
      'vue-i18n': {
        localeDir: './src/locales/**/*.json',
        messageSyntaxVersion: '^11.0.0',
      },
    },
  },
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'off',
      'import/no-webpack-loader-syntax': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },

  {
    /**
     * 启用 sort-keys 规则以强制对象键按字母顺序排序
     * 原因：
     * 1. 减少多人协作时的合并冲突
     * 2. 保持代码一致性，提高可维护性
     */
    files: ['src/locales/**/*.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc: pluginJsonc },
    rules: { 'jsonc/sort-keys': 'error' },
  },

  {
    // plugins: {
    //   '@stylistic': stylistic,
    // },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/define-macros-order': [
        'error',
        { order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'] },
      ],
      'vue/attributes-order': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/padding-line-between-blocks': ['error', 'always'],

      // '@stylistic/padding-line-between-statements': [
      //   'error',
      //   { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
      //   { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      //   { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      // ],
    },
  },

  skipFormatting,
);
