import type { ConfigEnv, PluginOption } from 'vite';

export default [
  // ...
] satisfies PluginOption;

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return [];
}
