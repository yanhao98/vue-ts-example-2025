/* https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#static-bundle-importing
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';

export function install({ app }: { app: import('vue').App<Element> }) {
  app.use(
    // https://vue-i18n.intlify.dev/guide/essentials/started.html#registering-the-i18n-plugin
    createI18n({
      legacy: false, // you must set `false`, to use Composition API
      locale: navigator.language,
      messages,
    }),
  );
}
