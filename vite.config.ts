import type { ManualChunkMeta, PreRenderedAsset } from 'rollup';
import { fileURLToPath, URL } from 'node:url';
import { createViteProxy } from 'utils4u/vite';
import { defineConfig, loadEnv } from 'vite';
import { optimizeDeps } from './vite.config.optimizeDeps';
import { Plugins } from './vite.config.plugins';

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const isBuild = command === 'build';
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_APP_BASE,
    build: {
      sourcemap: env.VITE_APP_BUILD_SOURCE_MAP === 'true',
      rollupOptions: {
        /* onwarn: (warning, warn) => {
          if (warning.code === 'EMPTY_BUNDLE') return;
          if (warning.code === 'EVAL' && warning.id?.includes('node_modules/eruda')) return;
          if (warning.code === 'EVAL' && warning.id?.includes('node_modules/mockjs')) return;
          if (warning.code === 'EVAL' && warning.id?.includes('node_modules/protobufjs')) return;
          warn(warning);
        }, */
        output: {
          // Keep hashed file names predictable across entry, chunk, and asset outputs.
          entryFileNames: '_entry/[name].[hash].js',
          chunkFileNames: '_chunk/[name].[hash].js',
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

          // https://www.npmjs.com/package/utils4u/v/2.19.2?activeTab=code
          manualChunks: (id: string, meta: ManualChunkMeta) => {
            if (id.includes('node_modules')) {
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
                // 根据包名分组
                if (packageName.includes('naive-ui')) {
                  return 'naive-ui';
                }
                if (packageName.includes('lodash')) {
                  return 'lodash';
                }
                if (packageName.includes('@juggle+resize-observer')) {
                  return 'resize-observer';
                }
                if (packageName.includes('date-fns')) {
                  return 'date-fns';
                }
                if (
                  ['primelocale', 'primevue', '@primeuix'].some((name) =>
                    packageName!.includes(name),
                  )
                ) {
                  return 'primevue';
                }
                // console.log('packageName :>> ', packageName);
                // console.log('id :>> ', id);
                if (['vue', 'vue-router', 'pinia', 'vue-demi'].includes(packageName)) {
                  return 'vue-vendor';
                }

                // return 'vendor';
              }
            }
          },
          // // Split key dependency groups to improve long-term caching.
          // manualChunks: (id) => {
          //   if (!id.includes('node_modules')) return;
          //   if (
          //     id.includes('node_modules/vue') ||
          //     id.includes('node_modules/@vue/') ||
          //     id.includes('node_modules/vue-router')
          //   ) {
          //     return 'vue-vendor';
          //   }
          //   if (id.includes('pinia') || id.includes('vue-i18n')) {
          //     return 'state-i18n';
          //   }
          //   if (id.includes('naive-ui')) {
          //     return 'naive-ui';
          //   }
          //   if (id.includes('primevue')) {
          //     return 'primevue';
          //   }
          //   if (id.includes('@vueuse')) {
          //     return 'vueuse';
          //   }
          //   return 'vendor';
          // },
        },
      },
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          // 使用 Sass 的现代编译器 API，提供更好的性能和新功能支持
          api: 'modern-compiler',
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
        },
      },
    },
    plugins: Plugins({ mode, env }),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __DEV__: JSON.stringify(!isBuild),
      // https://github.com/fi3ework/vite-plugin-checker/issues/569#issuecomment-3254311799
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    server: {
      allowedHosts: ['.NWCT.DEV'],
      proxy: createViteProxy(),
    },
    optimizeDeps: optimizeDeps(),
  };
});
