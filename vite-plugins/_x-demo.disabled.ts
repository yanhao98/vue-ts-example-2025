import type { ConfigEnv, PluginOption } from 'vite';
import { loadEnv } from 'vite';

export default [
  // ...
] satisfies PluginOption;

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  const env = loadEnv(_configEnv.mode, process.cwd());
  console.debug(`env :>> `, env);
  // ...
  return undefined;
}
