import './styles/index.ts';
import { LogLevels } from 'consola';
import App from './App.vue';
import { setupPlugins } from './plugins';

consola.level = LogLevels.verbose;

const autoInstallModules = import.meta.glob('./plugins/!(index).ts', {
  eager: true /* true 为同步，false 为异步 */,
});

const app = setupPlugins(createApp(App), autoInstallModules);
await new Promise((resolve) => setTimeout(resolve, 280));
app.mount('#app');
