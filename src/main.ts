import './styles/index.ts';
import { LogLevels } from 'consola';
import App from './App.vue';
import { setupPlugins } from './plugins';
import { router } from './plugins/00.router-plugin.ts';

consola.level = LogLevels.verbose;

const autoInstallModules = import.meta.glob('./plugins/!(index).ts', {
  eager: true /* true 为同步，false 为异步 */,
});

const app = setupPlugins(createApp(App), autoInstallModules);
await router.isReady();
await new Promise((resolve) => setTimeout(resolve, 280));
app.mount('#app');
