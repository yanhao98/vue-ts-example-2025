import type { PluginOption } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default [
  // https://github.com/FatehAK/vite-plugin-image-optimizer?tab=readme-ov-file#default-configuration
  ViteImageOptimizer({
    /* pass your config */
  }),
] satisfies PluginOption;
