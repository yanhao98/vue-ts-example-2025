import consola from 'consola';
import type { ConfigEnv, PluginOption } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export function loadPlugin(configEnv: ConfigEnv): PluginOption {
  if (configEnv.mode !== 'development') {
    consola.info('vue-devtools 插件仅在开发模式下使用。');
    return [];
  }

  let launchEditor = 'code';

  if (process.env.TERM_PROGRAM_VERSION?.toLowerCase()?.includes('insider')) {
    consola.info('检测到 VSCode Insiders 环境。');
    launchEditor = 'code-insiders';
  }

  return [
    vueDevTools({
      launchEditor: launchEditor,
    }),
  ];
}
