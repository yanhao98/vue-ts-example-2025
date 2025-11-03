/**
 * https://github.com/antfu-collective/vitesse/blob/47618e72dfba76c77b9b85b94784d739e35c492b/src/modules/README.md
 */
type UserPlugin = (ctx: UserPluginContext) => void;
type AutoInstallModule = { [K: string]: unknown; install?: UserPlugin };
type UserPluginContext = { app: import('vue').App<Element> };

const autoInstallModules: AutoInstallModule = import.meta.glob(
  ['./*.ts', '!./**/*.types.ts', '!./index.ts'],
  {
    eager: true /* true 为同步，false 为异步 */,
  },
);

export function setupPlugins(app: import('vue').App) {
  console.group(`🔌 Installing ${Object.keys(autoInstallModules).length} plugins`);
  for (const path in autoInstallModules) {
    const module = autoInstallModules[path] as AutoInstallModule;
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
