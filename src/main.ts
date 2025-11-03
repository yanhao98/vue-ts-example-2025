import './styles/index.ts';

import { LogLevels } from 'consola';
import App from './App.vue';
import { setupPlugins } from './plugins';
import { router } from './plugins/00.router-plugin.ts';

consola.level = LogLevels.verbose;

const app = createApp(App);
setupPlugins(app);
await router.isReady();
await new Promise((resolve) => setTimeout(resolve, 280));
app.mount('#app');
