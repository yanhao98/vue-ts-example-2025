import type { ManualChunkMeta, PreRenderedAsset, RollupOptions } from 'rollup';

import path from 'node:path';

// https://www.npmjs.com/package/utils4u/v/2.19.2?activeTab=code

export const viteConfigRollupOptions: RollupOptions = {
  /* onwarn: (warning, warn) => {
    if (warning.code === 'EMPTY_BUNDLE') return;
    if (warning.code === 'EVAL' && warning.id?.includes('node_modules/eruda')) return;
    if (warning.code === 'EVAL' && warning.id?.includes('node_modules/mockjs')) return;
    if (warning.code === 'EVAL' && warning.id?.includes('node_modules/protobufjs')) return;
    warn(warning);
  }, */

  output: {
    // Keep hashed file names predictable across entry, chunk, and asset outputs.
    entryFileNames: 'entry/[name].[hash].js', // 默认：	"[name].js"
    chunkFileNames: 'chunk/[name].[hash].js', // 默认：	"[name]-[hash].js"
    // assetFileNames:'', // 默认：	"assets/[name]-[hash][extname]"
    // https://cn.rollupjs.org/configuration-options/#output-assetfilenames
    assetFileNames(chunkInfo: PreRenderedAsset) {
      const names = chunkInfo.names;

      if (names.length !== 1) {
        console.error('Multiple names for asset:', chunkInfo);
        process.exit(1);
      }

      const assetName = names[0];
      const ext = assetName.split('.').pop()?.toLowerCase();
      if (ext && /png|jpe?g|gif|svg|webp|avif/.test(ext)) {
        return 'chunks/images/[name].[hash][extname]';
      }
      if (ext && /woff2?|ttf|otf/.test(ext)) {
        return 'chunks/fonts/[name].[hash][extname]';
      }
      if (ext === 'css') {
        return 'chunks/css/[name].[hash][extname]';
      }
      return '_chunks/[name].[hash][extname]';
    },

    manualChunks: (id: string, _meta: ManualChunkMeta) => {
      // https://github.com/unocss/unocss/issues/4917
      // if (['/src/layouts'].some((prefix) => id.includes(prefix))) {
      //   const url = new URL(id, 'file://');
      //   if (!url.search /* ?vue&type=script&setup=true&lang.ts */) {
      //     return 'layouts';
      //   }
      // }

      if (id.includes('meta-layouts')) {
        // console.debug(`id :>> `, id); // id :>>  virtual:meta-layouts
        // 这里很奇怪，打印 id 是`virtual:meta-layouts`，但是 `'virtual:meta-layouts' === id` 却是 false
        return 'lib-meta-layouts';
      }

      if (id.includes('index.page.vue')) {
        const url = new URL(id, 'file://');
        if (!url.search /* ?vue&type=script&setup=true&lang.ts */) {
          const parentDir = path.basename(path.dirname(id));
          return `${parentDir}-index.page`;
        }
      }

      if (!id.includes('node_modules')) return;
      // 处理 pnpm 的特殊路径结构
      let packageName;
      if (id.includes('.pnpm')) {
        // pnpm 路径: .pnpm/naive-ui@2.43.1_vue@3.5.22/node_modules/naive-ui/...
        const pnpmMatch = id.match(/\.pnpm\/(.+?)@/);
        if (pnpmMatch) {
          packageName = pnpmMatch[1];
        }
      } else {
        // 普通路径: node_modules/lodash/...
        const normalMatch = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)\//);
        if (normalMatch) {
          packageName = normalMatch[1];
        }
      }

      if (packageName) {
        if (['highlight.js'].includes(packageName)) {
          return 'lib-hljs';
        }

        // 根据包名分组
        if (['consola', 'lodash', '@juggle+resize-observer', 'vueuc'].includes(packageName)) {
          return 'lib-vendor';
        }

        // // 拆了有问题
        // if (['naive-ui'].includes(packageName) && id.includes('_internal')) {
        //   return 'lib-naive-ui-internal';
        // }

        if (['naive-ui'].includes(packageName)) {
          return 'lib-naive-ui';
        }

        if (['primelocale', 'primevue', '@primeuix'].some((name) => packageName!.includes(name))) {
          return 'lib-primevue';
        }

        if (['vue', 'vue-router', 'pinia', 'vue-demi', 'vue-i18n'].includes(packageName)) {
          return 'lib-vue-vendor';
        }
      }
    },
  },
};
