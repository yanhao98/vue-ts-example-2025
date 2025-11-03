/*eslint sort-keys: "error"*/
/**
 * 启用 sort-keys 规则以强制对象键按字母顺序排序
 * 原因：
 * 1. 减少多人协作时的合并冲突
 * 2. 保持代码一致性，提高可维护性
 */

export default {
  $Path: '$Path',
  Demos: '示例演示',
  DemosApiDemo: 'API 调用示例',
  DemosCounterDemo: '点击计数器',
  DemosCreate: '创建示例',
  DemosI18nDemo: '国际化示例',
  DemosNaiveUiDemo: 'Naive UI 组件示例',
  DemosPrimevueDemo: 'PrimeVue 组件示例',
  DemosWebsocketDemo: 'WebSocket 示例',
  Home: '首页',
  Login: '登录',
  Root: '根 (Gēn)',
} satisfies PageTitleLocalizations;
