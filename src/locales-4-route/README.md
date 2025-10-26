# `locales-4-route`

此目录存放专门用于**路由名称**的国际化（i18n）消息。这些消息通过一套自定义的编译时安全机制，为应用的导航菜单提供标题。

## 解决什么问题？

`unplugin-vue-router` 的 `definePage()` 宏在编译时执行，无法访问 Vue `<script setup>` 作用域中的运行时变量（如 `t()` 函数）。这使得在路由元信息（`meta`）中直接定义多语言标题变得不可能。

## 解决方案：自定义的编译时安全机制

我们采用一种**约定优于配置**的策略，并利用 TypeScript 进行编译时检查，以确保所有菜单标题都已定义。

**工作流程：**

1.  **`RouteNamedMap` 的生成**：`unplugin-vue-router` 会扫描你的页面组件，并自动生成一个名为 `RouteNamedMap` 的 TypeScript 类型，该类型包含了项目中所有具名路由的 `name`。

2.  **自定义全局类型**：我们定义了一个全局类型 `PageTitleLocalizations`：

    ```typescript
    declare global {
      type PageTitleLocalizations = Record<keyof RouteNamedMap, string>;
    }
    ```

    这个自定义类型创建了一个**契约**：任何满足此类型的对象，都**必须**为 `RouteNamedMap` 中的每一个路由名称提供一个字符串类型的键值对。

3.  **编译时检查**：此目录下的每个语言环境文件（如 `en-US.ts`）都必须使用 `satisfies PageTitleLocalizations` 来进行类型断言。

    ```typescript
    // src/locales-4-route/en-US.ts
    export default { ... } satisfies PageTitleLocalizations;
    ```

    这个操作会触发 TypeScript 在**编译时**进行检查。如果你新增了一个具名路由但忘记在此处添加翻译，**TypeScript 编译将会失败**，并明确提示你缺少的键。

4.  **菜单生成**：在运行时，`@/composables/useMetaLayoutsMenuOptions.tsx` 会获取当前路由的 `name`，并使用它作为键（`t(routeName)`）来查找并显示菜单标题。由于有编译时检查，我们可以确信翻译始终存在。

### 带来的好处

- **杜绝遗漏**：从根本上解决了菜单项标题缺失或显示为原始键的问题。
- **关注点分离**：路由定义只关心路由结构，显示文本则集中在此处管理。

### 开发者实践指南

1.  **理解路由命名规则**：
    `unplugin-vue-router` 会根据页面组件的**文件路径**自动生成 `PascalCase` 格式的路由 `name`。
    - **示例**：
      - 文件路径：`src/pages/demos/api-demo.page.vue`
      - 自动生成的路由 `name`：`DemosApiDemo`

2.  **添加对应的翻译**：
    使用上一步中自动生成的 `name` 作为键，在此目录的每个语言文件中添加翻译。

    ```ts
    // src/locales-4-route/zh-CN.ts
    export default {
      // ... 其他翻译
      DemosApiDemo: 'API 演示',
    } satisfies PageTitleLocalizations;

    // src/locales-4-route/en-US.ts
    export default {
      // ... 其他翻译
      DemosApiDemo: 'API Demo',
    } satisfies PageTitleLocalizations;
    ```
