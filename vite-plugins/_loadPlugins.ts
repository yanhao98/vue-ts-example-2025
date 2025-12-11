import boxen from 'boxen';
import consola from 'consola';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { glob } from 'tinyglobby';
import type { ConfigEnv, PluginOption } from 'vite';
import { loadEnv } from 'vite';

export type LoadPluginFunction = (
  configEnv: ConfigEnv & {
    env: Record<string, string>;
  },
) => PluginOption | LoadPluginResult;
export interface LoadPluginResult {
  plugins: PluginOption;
  message?: string;
}

export async function loadPlugins(configEnv: ConfigEnv): Promise<PluginOption[]> {
  const plugins: PluginOption[] = [];

  const cwd = path.resolve(import.meta.dirname);

  const pluginEntries = await glob('**/*.ts', {
    absolute: true,
    cwd,
    ignore: [
      '**/*.d.ts',
      '**/*.disabled.ts',
      '**/x-*.ts', // 禁用以 x- 开头的插件文件
      '**/*-x.ts', // 禁用以 -x 结尾的插件文件
      '**/*-X.ts', // 禁用以 -X 结尾的插件文件
      '**/_*',
    ],
  });

  const relativeCwd = path.relative(process.cwd(), cwd);
  console.time('加载插件');
  consola.log(
    boxen(`正在加载 Vite 插件... (./${relativeCwd})`, {
      borderStyle: 'classic',
      borderColor: 'cyan',
    }),
  );

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

    const env = loadEnv(configEnv.mode, process.cwd());
    const result = loadPlugin({ ...configEnv, env });

    // 判断是否是 LoadPluginResult 对象
    const isResultObject = (val: unknown): val is LoadPluginResult =>
      typeof val === 'object' && val !== null && 'plugins' in val;

    const plugin = isResultObject(result) ? result.plugins : result;
    const message = isResultObject(result) ? result.message : undefined;

    const pluginArray = Array.isArray(plugin) ? plugin : [plugin];
    const validPlugins = pluginArray.filter(Boolean);
    const pluginCount = validPlugins.length;

    if (pluginCount > 0) {
      plugins.push(...validPlugins);
      const suffix = message ? ` (${message})` : '';
      consola.info(`${paddedName} → ${pluginCount} 个实例${suffix}`);
    } else if (message) {
      consola.info(`${paddedName} → ${message}`);
    } else {
      consola.info(`${paddedName} 返回了空数组或无效值`);
    }
  }

  consola.success(`共 ${pluginEntries.length} 个插件文件，已加载 ${plugins.length} 个实例`);
  console.timeEnd('加载插件');

  return plugins;
}
