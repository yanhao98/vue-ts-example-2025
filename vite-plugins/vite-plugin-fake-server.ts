import type { ConfigEnv, PluginOption } from 'vite';
import { vitePluginFakeServer } from 'vite-plugin-fake-server';
// https://github.com/condorheroblog/vite-plugin-fake-server?tab=readme-ov-file#usage

// // if (mode !== 'test') {}
// export default [

// ] satisfies PluginOption;

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return vitePluginFakeServer({
    basename: 'fake-api',
    enableProd: true,
    include: 'fake',
  });
}
