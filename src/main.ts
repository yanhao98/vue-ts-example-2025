import './styles/index.ts';

// import { LogLevels } from 'consola';
// consola.level = LogLevels.verbose;

import App from './App.vue';

/* `import.meta.glob(${g}, { eager: ${isSync} })`; */
const autoInstallModules = import.meta.glob('./plugins/!(index).ts', { eager: true });

import { setupPlugins } from './plugins';

setupPlugins(createApp(App), autoInstallModules).mount('#app');
