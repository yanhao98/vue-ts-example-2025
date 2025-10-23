import type { PluginOption } from 'vite';
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl';

export default [
  // https://github.com/feat-agency/vite-plugin-webfont-dl?tab=readme-ov-file#-usage-simple-config-method-b-
  ViteWebfontDownload([
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
    'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap',
    'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,900',
  ]),
] satisfies PluginOption;
