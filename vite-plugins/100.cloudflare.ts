import { cloudflare } from '@cloudflare/vite-plugin';
import { loadEnv   } from 'vite';
import type {ConfigEnv, PluginOption} from 'vite';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  const env = loadEnv(_configEnv.mode, process.cwd());
  if (_configEnv.mode === 'test') {
    console.log('cloudflare plugin disabled in test mode');
    return [];
  }
  if (env.VITE_CLOUDFLARE_SERVER_ENABLED !== 'true') {
    console.log('cloudflare plugin disabled by env');
    return [];
  }
  return [cloudflare()];
}
