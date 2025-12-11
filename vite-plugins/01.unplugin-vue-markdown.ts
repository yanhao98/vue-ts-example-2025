import Markdown from 'unplugin-vue-markdown/vite';

import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = (_pluginLoadOptions) => {
  return [
    // https://github.com/unplugin/unplugin-vue-markdown
    Markdown({
      headEnabled: true,
    }),
  ];
};
