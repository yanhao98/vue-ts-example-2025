import { cloudflare } from '@cloudflare/vite-plugin';

import type { ConfigEnv, PluginOption } from 'vite';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  if (_configEnv.mode === 'test') {
    console.log('cloudflare plugin disabled in test mode');
    return [];
  }
  return [cloudflare()];
}
