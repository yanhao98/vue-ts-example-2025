export function install({ app }: { app: import('vue').App<Element> }) {
  app.use(i18nInstance);
}
