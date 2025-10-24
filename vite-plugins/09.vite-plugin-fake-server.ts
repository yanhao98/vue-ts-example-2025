import type { ConfigEnv, PluginOption } from 'vite';
import { vitePluginFakeServer } from 'vite-plugin-fake-server';
// https://github.com/condorheroblog/vite-plugin-fake-server?tab=readme-ov-file#usage

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  if (_configEnv.mode === 'test') {
    console.log('fake server plugin disabled in test mode');
    return [];
  }
  return vitePluginFakeServer({
    basename: 'fake-api',
    enableProd: true,
    include: 'fake',
  });
}
