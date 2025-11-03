import type { RouteNamedMap } from 'vue-router/auto-routes';

declare global {
  type PageTitleLocalizations = Record<keyof RouteNamedMap, string>;
}

declare module 'vue-router' {
  /* definePage({ meta: { title: '示例演示' } }); */
  interface RouteMeta {
    /**
     * @description 是否在菜单中隐藏
     */
    hideInMenu?: boolean;

    /**
     * @description 菜单标题 // !⚠️通过多语言标题方案（搜`PageTitleLocalizations`）维护标题
     */
    title?: string;

    /**
     * @description 使用的布局，设置为 false 则表示不使用布局
     */
    layout?: string | false;

    /**
     * @description 菜单项是否渲染为可点击链接，默认为 true
     * - true: 使用 RouterLink 包装，可点击跳转
     * - false: 仅渲染纯文本标签，不可点击（适用于分组标题）
     */
    link?: boolean;

    /**
     * @description 菜单排序权重，数值越小越靠前，未设置则按路径字母顺序排序
     */
    order?: number;

    /**
     * @description 是否忽略权限，默认为 false
     */
    ignoreAuth?: boolean;

    /**
     * @description 当前路由激活时应该高亮的菜单项（通过路由名称指定）
     * - 用于隐藏在菜单中的子页面，指定其父级菜单项应该高亮
     * - 使用路由名称而非路径，提供更好的类型安全和重构友好性
     * - 例如：`activeMenuName: 'Demos'` 会高亮 Demos 菜单项
     */
    activeMenuName?: keyof RouteNamedMap;
  }
}
