/* https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#static-bundle-importing
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages';

import { createI18n } from 'vue-i18n';

const locale = useLocalStorage<string>('app-locale', navigator.language);

// https://vue-i18n.intlify.dev/guide/essentials/started.html#registering-the-i18n-plugin
export const i18nInstance = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: locale.value,
  fallbackRoot: false,
  // flatJson: true,
  missing: (locale, key /* , instance, type */) => {
    consola.warn(`缺少国际化内容: locale='${locale}', key='${key}'`);
    return `[${key}]`;
  },
  missingWarn: !true,
  fallbackWarn: !true,
  messages,
});

watchEffect(() => {
  locale.value = i18nInstance.global.locale.value;
});
