import { createHead } from '@unhead/vue/client';

export function install({ app }: { app: import('vue').App<Element> }) {
  app.use(createHead());
}
