import consola from 'consola';
import { loadEnv, type ConfigEnv, type PluginOption } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export function loadPlugin(configEnv: ConfigEnv): PluginOption {
  const env = loadEnv(configEnv.mode, process.cwd());

  if (env.VITE_ENABLE_VUE_DEVTOOLS === 'true') {
    return [vueDevTools()];
  } else {
    consola.info('VITE_ENABLE_VUE_DEVTOOLS is not enabled.');
    return [];
  }
}
