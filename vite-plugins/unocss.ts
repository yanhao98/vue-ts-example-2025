import type { PluginOption } from 'vite';
import UnoCSS from 'unocss/vite';

export default [
  // https://github.com/antfu/unocss
  // see uno.config.ts for config
  UnoCSS(),
] satisfies PluginOption;
