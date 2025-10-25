import consola from 'consola';
import path from 'node:path';
import { fileURLToPath, pathToFileURL, URL } from 'node:url';
import { glob } from 'tinyglobby';
import { createViteProxy } from 'utils4u/vite';
import { defineConfig, loadEnv, type ConfigEnv, type PluginOption } from 'vite';
import { optimizeDeps } from './vite.config.optimizeDeps';
import { viteConfigRollupOptions } from './vite.config.rollup.output';

type LoadPluginFunction = (configEnv: ConfigEnv) => PluginOption;
async function loadPlugins(configEnv: ConfigEnv): Promise<PluginOption[]> {
  const plugins: PluginOption[] = [];

  consola.start('开始加载 Vite 插件...');

  const pluginEntries = await glob('**/*.ts', {
    absolute: true,
    cwd: path.resolve(import.meta.dirname, 'vite-plugins'),
    ignore: [
      '**/*.d.ts',
      '**/*.disabled.ts',
      '**/x-*.ts', // 禁用以 x- 开头的插件文件
      '**/_*',
    ],
  });

  consola.info(`找到 ${pluginEntries.length} 个插件文件`);

  // 计算最长的文件名长度，用于对齐输出
  const maxNameLength = Math.max(...pluginEntries.map((entry) => path.basename(entry).length));

  for (const entry of pluginEntries) {
    const pluginName = path.basename(entry);
    const paddedName = pluginName.padEnd(maxNameLength, ' ');
    const imported = await import(pathToFileURL(entry).href);

    const loadPlugin = imported.loadPlugin as LoadPluginFunction | undefined;
    let plugin: PluginOption | undefined;
    let loadMethod = '';

    // 优先使用 loadPlugin 函数（接收 configEnv 参数）
    if (loadPlugin && typeof loadPlugin === 'function') {
      plugin = loadPlugin(configEnv);
      loadMethod = 'loadPlugin';
    } else if (imported.default) {
      plugin = imported.default;
      loadMethod = 'default';
    } else {
      consola.warn(`插件未导出有效内容: ${paddedName}`);
      continue; // 跳过无效插件
    }

    if (plugin) {
      const pluginArray = Array.isArray(plugin) ? plugin : [plugin];
      const validPlugins = pluginArray.filter(Boolean); // 过滤掉 null/undefined
      const pluginCount = validPlugins.length;

      if (pluginCount > 0) {
        plugins.push(...validPlugins);
        consola.success(`${paddedName} → ${pluginCount} 个实例 (${loadMethod})`);
      } else {
        consola.info(`${paddedName} 返回了空数组或无效值`);
      }
    }
  }

  consola.success(`✅ 总共加载了 ${plugins.length} 个插件实例`);

  return plugins;
}

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
