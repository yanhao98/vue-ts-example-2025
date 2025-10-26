import consola from 'consola';
import type { ConfigEnv, PluginOption } from 'vite';
import { loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export function loadPlugin(configEnv: ConfigEnv): PluginOption {
  const env = loadEnv(configEnv.mode, process.cwd());

  if (configEnv.command === 'build') {
    consola.info('vue-devtools plugin is not used in build mode.');
    return [];
  }

  if (env.VITE_ENABLE_VUE_DEVTOOLS !== 'true') {
    consola.info('vue-devtools plugin disabled by env');
    return [];
  }

  return [vueDevTools()];
}
