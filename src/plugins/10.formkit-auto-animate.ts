import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

export function install({ app }: { app: import('vue').App<Element> }) {
  app.use(autoAnimatePlugin); // v-auto-animate="{ duration: 100 }"
}
