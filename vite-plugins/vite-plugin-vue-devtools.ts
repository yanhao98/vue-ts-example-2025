import type { PluginOption } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// env.VITE_ENABLE_VUE_DEVTOOLS === 'true'

export default [vueDevTools()] satisfies PluginOption;
