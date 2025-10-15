import { fileURLToPath, URL } from 'node:url';
import { createViteProxy } from 'utils4u/vite';
import { defineConfig, loadEnv } from 'vite';
import { optimizeDeps } from './vite.config.optimizeDeps';
import { Plugins } from './vite.config.plugins';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
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
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          // https://cn.rollupjs.org/configuration-options/#output-assetfilenames
          assetFileNames: (assetInfo) => {
            if (assetInfo.names.length > 1) {
              console.warn('Multiple names for asset:', assetInfo);
            }
            const assetName =
              assetInfo.names.find(Boolean) ?? assetInfo.originalFileNames.find(Boolean) ?? '';
            const ext = assetName.split('.').pop()?.toLowerCase();
            if (ext && /png|jpe?g|gif|svg|webp|avif/.test(ext)) {
              return 'assets/images/[name].[hash][extname]';
            }
            if (ext && /woff2?|ttf|otf/.test(ext)) {
              return 'assets/fonts/[name].[hash][extname]';
            }
            if (ext === 'css') {
              return 'assets/css/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
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
      preprocessorOptions: {
        scss: {
          // 使用 Sass 的现代编译器 API，提供更好的性能和新功能支持
          api: 'modern-compiler',
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
        },
      },
    },
    plugins: Plugins({ mode }),
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
