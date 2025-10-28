/**
 * 需要把 <DynamicDialog /> <ConfirmDialog /> <Toast /> 放在 App.vue 的 template 中
 */

import Aura from '@primeuix/themes/aura';
import zhCN from 'primelocale/zh-CN.json';
import PrimeVue from 'primevue/config';
import StyleClass from 'primevue/styleclass';
import ToastService from 'primevue/toastservice';

export function install({ app }: { app: import('vue').App<Element> }) {
  app.directive('styleclass', StyleClass);
  app.use(PrimeVue, {
    locale: {
      ...zhCN['zh-CN'],
      completed: '已上传',
      noFileChosenMessage: '未选择文件',
      pending: '待上传',
    }, // usePrimeVue().config.locale
    theme: {
      options: {
        cssLayer: false,
        darkModeSelector: '.app-dark' /* 'system' */,
        prefix: 'p',
      },
      preset: Aura,
    },
  });
  app.use(ToastService);
}
