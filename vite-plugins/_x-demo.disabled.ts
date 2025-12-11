import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = (_pluginLoadOptions) => {
  const env = _pluginLoadOptions.env;

  // 示例：根据环境变量禁用插件并返回消息
  if (env.VITE_DEMO_ENABLED !== 'true') {
    return {
      plugins: [],
      message: `已通过环境变量禁用: VITE_DEMO_ENABLED=${env.VITE_DEMO_ENABLED}`,
    };
  }

  // 正常返回插件
  return [];
};
