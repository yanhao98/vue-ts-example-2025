import { cloudflare } from '@cloudflare/vite-plugin';

import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = (pluginLoadOptions) => {
  const { mode, env } = pluginLoadOptions;
  if (mode === 'test') {
    return { plugins: [], message: '在测试模式下禁用' };
  }
  if (env.VITE_CLOUDFLARE_SERVER_ENABLED !== 'true') {
    return {
      plugins: [],
      message: `已通过环境变量禁用: VITE_CLOUDFLARE_SERVER_ENABLED=${env.VITE_CLOUDFLARE_SERVER_ENABLED}`,
    };
  }
  return [cloudflare()];
};
