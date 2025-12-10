import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import type { ConfigEnv, PluginOption } from 'vite';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return [
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: ['src/locales/**'],

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#transformi18nblock
      // transformI18nBlock(src) {
      //   console.debug(`src :>> `, src);
      //   console.debug(`typeof src :>> `, typeof src);
      //   return src as string;
      // },
    }),
  ];
}
