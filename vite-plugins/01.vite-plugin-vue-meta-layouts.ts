import type { ConfigEnv, PluginOption } from 'vite';
import MetaLayouts from 'vite-plugin-vue-meta-layouts';

export function loadPlugin(_configEnv: ConfigEnv): PluginOption {
  return [
    // https://github.com/dishait/vite-plugin-vue-meta-layouts
    MetaLayouts({
      target: 'src/layouts',
      excludes: ['**/!(the-)*.vue'], // 排除非 the- 开头的文件。
      metaName: 'layout',
      // defaultLayout: 'sakai-vue/AppLayout',
      // defaultLayout: 'naive-ui/AppLayout',
      defaultLayout: 'base-layout/the-base-layout',
      // !⬇️: 当设置为 `sync` 时，注意`import 'virtual:uno.css'`的顺序问题。
      // importMode: 'sync', // 默认为自动处理，SSG 时为 sync，非 SSG 时为 async
      skipTopLevelRouteLayout: true, // 打开修复 https://github.com/JohnCampionJr/vite-plugin-vue-layouts/issues/134，默认为 false 关闭
    }),
  ];
}
