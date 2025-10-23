import type { PluginOption } from 'vite';
import Markdown from 'unplugin-vue-markdown/vite';

export default [
  // https://github.com/unplugin/unplugin-vue-markdown
  Markdown({
    headEnabled: true,
  }),
] satisfies PluginOption;
