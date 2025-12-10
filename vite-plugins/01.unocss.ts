import type { ConfigEnv, PluginOption } from 'vite';
import UnoCSS from 'unocss/vite';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return [
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS({
      checkImport: true,
    }),
  ];
}
