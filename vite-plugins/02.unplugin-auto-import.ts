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

import fs from 'node:fs';
import path from 'node:path';

function _getNaiveUiComponentNames() {
  // 方法1: 从 web-types.json 读取（推荐）
  const webTypesPath = path.resolve('node_modules/naive-ui/web-types.json');
  if (fs.existsSync(webTypesPath)) {
    const webTypes = JSON.parse(fs.readFileSync(webTypesPath, 'utf-8'));
    const components = webTypes.contributions.html['vue-components'];
    const componentNames = components.map((component: { name: string }) => component.name);
    console.log('naive-ui components count (from web-types.json):', componentNames.length);
    return componentNames;
  }

  // 方法2: 从 volar.d.ts 读取（备选）
  const volarPath = path.resolve('node_modules/naive-ui/volar.d.ts');
  if (fs.existsSync(volarPath)) {
    const volarContent = fs.readFileSync(volarPath, 'utf-8');
    // 匹配类似 "NAffix: (typeof import('naive-ui'))['NAffix']" 的行
    const regex = /^\s+(N\w+):/gm;
    const matches = [...volarContent.matchAll(regex)];
    const componentNames = matches.map((match) => match[1]);
    console.log('naive-ui components count (from volar.d.ts):', componentNames.length);
    return componentNames;
  }

  console.warn('Could not find naive-ui component metadata files');
  return [];
}

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
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
          'naive-ui': [
            'useModal',
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
            ..._getNaiveUiComponentNames(),
          ],
        },
      ],
      vueTemplate: true,
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // `__`开头的
      excludeNames: [/^__/],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md', 'tsx'],
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
