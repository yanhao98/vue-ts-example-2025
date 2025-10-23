import type { PluginOption } from 'vite';
import MetaLayouts from 'vite-plugin-vue-meta-layouts';

export default [
  // https://github.com/dishait/vite-plugin-vue-meta-layouts
  MetaLayouts({
    // defaultLayout: 'sakai-vue/AppLayout',
    // defaultLayout: 'naive-ui/AppLayout',
    defaultLayout: 'base-layout/base-layout',
    skipTopLevelRouteLayout: true, // 打开修复 https://github.com/JohnCampionJr/vite-plugin-vue-layouts/issues/134，默认为 false 关闭
  }),
] satisfies PluginOption;
