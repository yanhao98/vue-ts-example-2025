## 依赖管理

```shell
pnpm dedupe
```

去除重复的依赖包。当你的项目中存在多个版本的同一个包时，pnpm dedupe 会尝试将它们合并成尽可能少的版本，从而减少 node_modules 的体积。

```bash
pnpm dlx taze major --interactive
```

交互式地将项目依赖升级到最新的主要版本，可以逐个选择要升级哪些包。

```bash
pnpm dlx knip
```

检测项目中未使用的依赖、导出和文件，帮助清理冗余代码。

## Playwright

```bash
playwright test
```

- `HEADLESS=true`：强制无头模式
- `--ui`：启动 Playwright 的图形用户界面，方便调试测试用例
- `--project=chromium`：指定使用 Chromium 浏览器进行测试
- `--quiet`：减少输出信息，只显示必要的内容

## Oxlint

```bash
oxlint . --fix --ignore-path=.gitignore --print-config
```

```bash
oxlint . --fix --deny=correctness
```

## Wrangler

### Pages

```bash
wrangler pages deploy dist --project-name=vue-ts-example-2025 --branch=preview
```

```bash
wrangler pages deploy dist --project-name=vue-ts-example-2025
```

### Workers

```bash
wrangler deploy
```

```bash
wrangler versions upload
```

## 拆包体积分析

- https://github.com/nonzzz/vite-bundle-analyzer
- https://github.com/KusStar/vite-bundle-visualizer

```bash
pnpm dlx vite-bundle-visualizer -t treemap
pnpm dlx vite-bundle-visualizer -t sunburst
pnpm dlx vite-bundle-visualizer -t network
```
