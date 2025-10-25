import { fileURLToPath, URL } from 'node:url';
import { createViteProxy } from 'utils4u/vite';
import { defineConfig, loadEnv } from 'vite';
import { loadPlugins } from './vite-plugins/_loadPlugins';
import { optimizeDeps } from './vite.config.optimizeDeps';
import { viteConfigRollupOptions } from './vite.config.rollup.output';

// https://vite.dev/config/
export default defineConfig(async (configEnv) => {
  const { command, mode } = configEnv;

  const isBuild = command === 'build';
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_APP_BASE,
    build: {
      minify: env.VITE_APP_BUILD_MINIFY === 'true' ? undefined /* 即默认 */ : false, // 默认：	'terser'
      sourcemap: env.VITE_APP_BUILD_SOURCE_MAP === 'true',
      rollupOptions: viteConfigRollupOptions,
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
    plugins: await loadPlugins(configEnv),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __DEV__: JSON.stringify(!isBuild),
      // // https://github.com/fi3ework/vite-plugin-checker/issues/569#issuecomment-3254311799
      // 'process.env.NODE_ENV': JSON.stringify('production'),
    },
    server: {
      allowedHosts: ['.NWCT.DEV'],
      proxy: createViteProxy(),
      watch: {
        // 监听 vite-plugins 目录的变化，触发配置文件重新加载
        ignored: ['!**/vite-plugins/**'],
      },
    },
    optimizeDeps: optimizeDeps(),
  };
});
