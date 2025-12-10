import type { ConfigEnv, PluginOption } from 'vite';
import Markdown from 'unplugin-vue-markdown/vite';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return [
    // https://github.com/unplugin/unplugin-vue-markdown
    Markdown({
      headEnabled: true,
    }),
  ];
}
