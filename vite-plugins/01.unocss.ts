import UnoCSS from 'unocss/vite';

import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = (_pluginLoadOptions) => {
  return [
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS({
      checkImport: true,
    }),
  ];
};
