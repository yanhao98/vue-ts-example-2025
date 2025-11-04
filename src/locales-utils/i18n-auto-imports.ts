/* https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#static-bundle-importing
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/unplugin-vue-i18n/messages';

import { router } from '@/plugins/00.router-plugin';
import { createGetRoutes } from 'virtual:meta-layouts';
import { createI18n } from 'vue-i18n';
import { START_LOCATION } from 'vue-router';

const locale = useLocalStorage<string>('app-locale', navigator.language);
watchEffect(() => {
  window.document.documentElement.setAttribute('lang', locale.value);
});

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

export const routeI18nInstance = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: locale.value,
  inheritLocale: true,
  useScope: 'local',
  missing: (locale, key) => {
    consola.warn(`菜单翻译缺失: locale=${locale}, key=${key}`);
    return key;
  },
  fallbackRoot: true,
  messages: i18nRouteMessages,
});

watchEffect(
  () => {
    locale.value = i18nInstance.global.locale.value;
  },
  { flush: 'sync' },
);

watch(
  () => i18nInstance.global.locale.value,
  () => {
    const { t, te } = routeI18nInstance.global;

    routeI18nInstance.global.locale.value = i18nInstance.global.locale.value;

    if (router.currentRoute.value.name && router.currentRoute.value !== START_LOCATION) {
      router.currentRoute.value.meta.title = t(router.currentRoute.value.name as string);
    }

    const routes = createGetRoutes(router)(); // 获取路由表但是不包含布局路由

    routes.forEach((route) => {
      const routeName = route.name as string;
      route.meta.title = te(routeName) ? t(routeName) : routeName;
    });
  },
  { immediate: true, flush: 'sync' },
);
