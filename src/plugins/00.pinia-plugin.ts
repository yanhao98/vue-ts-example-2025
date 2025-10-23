import { PiniaColada } from '@pinia/colada';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
export function install({ app }: { app: import('vue').App<Element> }) {
  app.use(createPinia() /* .use(piniaPluginPersistedstate) */);
  app.use(PiniaColada, {});
}
