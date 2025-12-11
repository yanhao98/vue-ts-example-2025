import { vitePluginFakeServer } from 'vite-plugin-fake-server';

import type { LoadPluginFunction } from './_loadPlugins';

// https://github.com/condorheroblog/vite-plugin-fake-server?tab=readme-ov-file#usage
export const loadPlugin: LoadPluginFunction = (pluginLoadOptions) => {
  const { mode } = pluginLoadOptions;
  if (mode !== 'development') {
    return { plugins: [], message: '仅在开发模式下启用' };
  }
  return vitePluginFakeServer({
    basename: 'fake-api',
    enableProd: true,
    include: 'fake',
  });
};
