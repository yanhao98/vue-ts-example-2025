import type { PluginOption } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import { createUtils4uAutoImports } from 'utils4u/auto-imports';
import { VueRouterAutoImports } from 'unplugin-vue-router';

export default [
  // https://github.com/antfu/unplugin-auto-import
  AutoImport({
    dirs: [
      // 'src/composables',
      // 'src/utils',
      'src/stores',
    ],
    imports: [
      'vue',
      'vue-i18n',
      'pinia',
      '@vueuse/core',
      VueRouterAutoImports,
      createUtils4uAutoImports([]),
      {
        'consola/browser': ['consola'],
        'vue-router/auto': ['useLink'],
        'naive-ui': ['useModal', 'useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
      },
    ],
    vueTemplate: true,
  }),
] satisfies PluginOption;
