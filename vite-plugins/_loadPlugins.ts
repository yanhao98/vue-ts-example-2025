import path from 'node:path';
import { pathToFileURL } from 'node:url';

import consola from 'consola';
import { glob } from 'tinyglobby';
import type { ConfigEnv, PluginOption } from 'vite';

type LoadPluginFunction = (configEnv: ConfigEnv) => PluginOption;
export async function loadPlugins(configEnv: ConfigEnv): Promise<PluginOption[]> {
  const plugins: PluginOption[] = [];

  consola.start('开始加载 Vite 插件...');

  const pluginEntries = await glob('**/*.ts', {
    absolute: true,
    cwd: path.resolve(import.meta.dirname),
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
