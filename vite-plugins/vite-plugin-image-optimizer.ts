import type { PluginOption } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// env.VITE_ENABLE_VUE_DEVTOOLS === 'true'

export default [
  // https://github.com/FatehAK/vite-plugin-image-optimizer?tab=readme-ov-file#default-configuration
  ViteImageOptimizer({
    /* pass your config */
  }),
] satisfies PluginOption;
