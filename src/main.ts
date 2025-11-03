import './styles/index.ts';

import { LogLevels } from 'consola';
import App from './App.vue';
import { setupPlugins } from './plugins';

consola.level = LogLevels.verbose;

const app = createApp(App);
setupPlugins(app);

await new Promise((resolve) => setTimeout(resolve, 280));
app.mount('#app');
