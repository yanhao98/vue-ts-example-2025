### Husky 遇到 command not found: husky

- https://typicode.github.io/husky/zh/troubleshoot.html#找不到命令-command-not-found
- https://typicode.github.io/husky/zh/how-to.html#node-版本管理器和-gui

```bash
ln -s $(which pnpm) $HOME/.local/bin/pnpm
```

```bash
if command -v pnpm >/dev/null 2>&1; then
    # 如果 pnpm 可用，直接使用它
    pnpm exec lint-staged
else
    # 如果 pnpm 不可用，使用 $HOME/.local/bin/pnpm
    # ln -s $(which pnpm) $HOME/.local/bin/pnpm
    echo "找不到 pnpm，使用 $HOME/.local/bin/pnpm"
    "$HOME"/.local/bin/pnpm exec lint-staged
fi
```
