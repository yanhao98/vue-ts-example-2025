import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = (_pluginLoadOptions) => {
  return [
    // https://github.com/FatehAK/vite-plugin-image-optimizer?tab=readme-ov-file#default-configuration
    ViteImageOptimizer({
      /* pass your config */
    }),
  ];
};
