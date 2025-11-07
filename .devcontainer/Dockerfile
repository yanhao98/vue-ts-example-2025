FROM debian:13.1-slim

# 元数据
LABEL maintainer="i@oo1.dev" \
      description="Development container for Claude and Gemini development"

# 构建参数
ARG GIT_DELTA_VERSION=0.18.2
ARG ZSH_IN_DOCKER_VERSION=1.2.1
ARG PNPM_HOME="/home/usr_vscode/.local/share/pnpm"
ARG PATH="$PNPM_HOME:$PATH"

# 环境变量
ENV LANG=zh_CN.UTF-8 \
    LC_ALL=zh_CN.UTF-8 \
    # Set `DEVCONTAINER` environment variable to help with orientation
    DEVCONTAINER=true \
    # Set the default shell to zsh rather than sh
    SHELL=/bin/zsh \
    # Set the default editor and visual
    EDITOR=nano \
    VISUAL=nano \
    POWERLEVEL9K_DISABLE_GITSTATUS=true

# 安装所有系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    # 语言包
    locales \
    # 基础工具
    ca-certificates wget curl \
    # 开发工具
    less git procps sudo fzf zsh man-db unzip gnupg2 gh \
    # 网络工具
    iptables ipset iproute2 dnsutils aggregate \
    # 编辑器和实用工具
    jq nano vim \
    # 配置中文环境
    && sed -i 's/^# *zh_CN.UTF-8/zh_CN.UTF-8/' /etc/locale.gen \
    && locale-gen zh_CN.UTF-8 \
    && update-locale LANG=zh_CN.UTF-8 \
    # 清理缓存
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 创建用户和配置 sudo
RUN groupadd --gid 1000 usr_vscode \
    && useradd --uid 1000 --gid usr_vscode --shell /bin/zsh --create-home usr_vscode \
    && echo "usr_vscode ALL=(root) NOPASSWD: ALL" > /etc/sudoers.d/usr_vscode_user_config \
    && chmod 0440 /etc/sudoers.d/usr_vscode_user_config \
    && cat /etc/passwd

# 配置命令历史
RUN mkdir -p /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R usr_vscode:usr_vscode /commandhistory

# 创建工作目录
RUN mkdir -p /workspace /home/usr_vscode/.claude \
    && chown -R usr_vscode:usr_vscode /workspace /home/usr_vscode/.claude

# 安装 git-delta https://github.com/dandavison/delta/releases
RUN ARCH=$(dpkg --print-architecture) && \
  curl -L -o "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  sudo dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

WORKDIR /workspace

# 切换到非 root 用户
USER usr_vscode

# 配置 Zsh https://github.com/deluan/zsh-in-docker/releases
# Default powerline10k theme
RUN touch /home/usr_vscode/.zshrc \
    && sh -c "$(curl -L -o - https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
       -p git \
       -p fzf \
       -a "source <(fzf --zsh)" \
       -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
       -x
      # -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
      # -a "source /usr/share/doc/fzf/examples/completion.zsh" \

# 安装 pnpm 和 Node.js
# https://pnpm.io/installation#in-a-docker-container
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.zshrc" SHELL="$(which zsh)" zsh - \
    && pnpm --version \
    && pnpm env use lts --global \
    && pnpm config set store-dir /home/usr_vscode/.pnpm-store

# 安装 AI 工具
RUN pnpm install -g \
    @google/gemini-cli@latest \
    @anthropic-ai/claude-code@latest \
    @musistudio/claude-code-router@latest
