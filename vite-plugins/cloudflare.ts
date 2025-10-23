import type { PluginOption } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default [cloudflare()] satisfies PluginOption;
