/**
 * https://github.com/antfu-collective/vitesse/blob/47618e72dfba76c77b9b85b94784d739e35c492b/src/modules/README.md
 */
type UserPlugin = (ctx: UserPluginContext) => void;
type AutoInstallModule = { [K: string]: unknown; install?: UserPlugin };
type UserPluginContext = { app: import('vue').App<Element> };
export function setupPlugins(
  app: import('vue').App,
  modules: AutoInstallModule | Record<string, unknown>,
) {
  console.group('🔌 Plugins');
  for (const path in modules) {
    const module = modules[path] as AutoInstallModule;
    if (module.install) {
      module.install({ app });
      console.debug(`%c✔ ${path}`, 'color: #07a');
    } else {
      if (typeof module.setupPlugins === 'function') continue;
      console.warn(`%c✘ ${path} has no install function`, 'color: #f50');
    }
  }
  console.groupEnd();
  return app;
}
