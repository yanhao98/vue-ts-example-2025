import type { ConfigEnv, PluginOption } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return [
    // https://github.com/FatehAK/vite-plugin-image-optimizer?tab=readme-ov-file#default-configuration
    ViteImageOptimizer({
      /* pass your config */
    }),
  ];
}
