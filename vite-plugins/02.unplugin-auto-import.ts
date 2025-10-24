import type { ConfigEnv, PluginOption } from 'vite';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';

import { VueRouterAutoImports } from 'unplugin-vue-router';
import { createUtils4uAutoImports } from 'utils4u/auto-imports';

import { FileSystemIconLoader } from 'unplugin-icons/loaders';

// >>>>>
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

import { TDesignResolver } from 'unplugin-vue-components/resolvers';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';

import IconsResolver from 'unplugin-icons/resolver';

import { VantResolver } from '@vant/auto-import-resolver';
// <<<<<
export async function loadPlugin(_configEnv: ConfigEnv): Promise<PluginOption> {
  return [
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      dirs: [
        // 'src/utils',
        'src/composables',
        'src/stores',
        // 匹配所有 -auto-imports.ts / -auto-imports.tsx 结尾的文件
        'src/**/*-auto-imports.{ts,tsx}',
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
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // `__`开头的
      excludeNames: [/^__/],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
          resolveIcons: true,
        }),
        IconsResolver({
          customCollections: ['svg'],
          prefix: 'icon' /* <icon-svg:demo /> or <icon-svg-demo /> */,
        }), // https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#auto-importing
        TDesignResolver({ esm: true, library: 'mobile-vue' }),
        VantResolver({ importStyle: true }),
        PrimeVueResolver(/* { components: { prefix: 'P' } } */),
        NaiveUiResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
      customCollections: {
        svg: FileSystemIconLoader('src/assets/icons/svgs', (svg) => {
          return svg.replace(/^<svg /, '<svg fill="currentColor" ');
        }),
      },
      iconCustomizer(collection, icon, properties) {
        properties.class = 'unplugin-icons';
      },
    }),
  ];
}
