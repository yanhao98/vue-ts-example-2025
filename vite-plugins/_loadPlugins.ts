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
      '**/*-x.ts', // 禁用以 -x 结尾的插件文件
      '**/*-X.ts', // 禁用以 -X 结尾的插件文件
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

    if (!loadPlugin || typeof loadPlugin !== 'function') {
      consola.warn(`插件未导出 loadPlugin 函数: ${paddedName}`);
      continue;
    }

    const plugin = loadPlugin(configEnv);
    const pluginArray = Array.isArray(plugin) ? plugin : [plugin];
    const validPlugins = pluginArray.filter(Boolean);
    const pluginCount = validPlugins.length;

    if (pluginCount > 0) {
      plugins.push(...validPlugins);
      consola.success(`${paddedName} → ${pluginCount} 个实例`);
    } else {
      consola.info(`${paddedName} 返回了空数组或无效值`);
    }
  }

  consola.success(`✅ 总共加载了 ${plugins.length} 个插件实例`);

  return plugins;
}
