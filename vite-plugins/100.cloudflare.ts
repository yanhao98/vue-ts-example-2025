import { cloudflare } from '@cloudflare/vite-plugin';

import type { ConfigEnv, PluginOption } from 'vite';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  if (_configEnv.mode === 'test') {
    console.log('cloudflare plugin disabled in test mode');
    return [];
  }
  if (process.env.VITE_CLOUDFLARE_SERVER_ENABLED !== 'true') {
    console.log('cloudflare plugin disabled by env');
    return [];
  }
  return [cloudflare()];
}
