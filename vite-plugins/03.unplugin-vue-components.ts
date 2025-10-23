import type { PluginOption } from 'vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { VantResolver } from '@vant/auto-import-resolver';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import {
  AntDesignVueResolver,
  NaiveUiResolver,
  TDesignResolver,
} from 'unplugin-vue-components/resolvers';

export default [
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
] satisfies PluginOption;
