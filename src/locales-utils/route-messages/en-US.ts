/*eslint sort-keys: "error"*/
/**
 * 启用 sort-keys 规则以强制对象键按字母顺序排序
 * 原因：
 * 1. 减少多人协作时的合并冲突
 * 2. 保持代码一致性，提高可维护性
 */

export default {
  $Path: '$Path',
  Demos: 'Demos',
  DemosApiDemo: 'API Demo',
  DemosCounterDemo: 'Counter Demo',
  DemosCreate: 'Create Demo',
  DemosI18nDemo: 'i18n Demo',
  DemosNaiveUiDemo: 'Naive UI Demo',
  DemosPrimevueDemo: 'PrimeVue Demo',
  DemosWebsocketDemo: 'WebSocket Demo',
  Home: 'Home',
  Login: 'Login',
  Root: 'Index',
} satisfies PageTitleLocalizations;
