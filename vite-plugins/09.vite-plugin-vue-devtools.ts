import vueDevTools from 'vite-plugin-vue-devtools';

import type { LoadPluginFunction } from './_loadPlugins';

export const loadPlugin: LoadPluginFunction = (_pluginLoadOptions) => {
  const { mode } = _pluginLoadOptions;
  if (mode !== 'development') {
    return { plugins: [], message: '仅在开发模式下启用' };
  }

  let launchEditor = 'code';
  let message: string | undefined;

  if (process.env.TERM_PROGRAM_VERSION?.toLowerCase()?.includes('insider')) {
    launchEditor = 'code-insiders';
    message = '检测到 VSCode Insiders 环境';
  }

  return {
    plugins: [
      vueDevTools({
        launchEditor: launchEditor,
      }),
    ],
    message,
  };
};
