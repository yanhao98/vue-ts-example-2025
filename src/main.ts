import './styles/index.ts';
import { LogLevels } from 'consola';
import App from './App.vue';
import { setupPlugins } from './plugins';

consola.level = LogLevels.verbose;

/* `import.meta.glob(${g}, { eager: ${isSync} })`; */
const autoInstallModules = import.meta.glob('./plugins/!(index).ts', { eager: true });

setupPlugins(createApp(App), autoInstallModules).mount('#app');
