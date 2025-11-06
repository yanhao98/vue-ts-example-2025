FROM debian:13.1-slim


# 安装中文语言包
RUN apt-get update && apt-get install -y locales && \
    sed -i 's/^# *zh_CN.UTF-8/zh_CN.UTF-8/' /etc/locale.gen && \
    locale-gen zh_CN.UTF-8 && \
    update-locale LANG=zh_CN.UTF-8

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  wget \
  curl

# Install basic development tools and iptables/ipset
RUN apt-get update && apt-get install -y --no-install-recommends \
  less \
  git \
  procps \
  sudo \
  fzf \
  zsh \
  man-db \
  unzip \
  gnupg2 \
  gh \
  iptables \
  ipset \
  iproute2 \
  dnsutils \
  aggregate \
  jq \
  nano \
  vim \
  && apt-get clean && rm -rf /var/lib/apt/lists/*


# 创建 usr_vscode 用户和组，UID 和 GID 都是 1000 # https://github.com/nodejs/docker-node/blob/27dd50d60e181b3da84a17d9c5037dcfeb94b781/24/bookworm/Dockerfile#L3
RUN groupadd --gid 1000 usr_vscode \
  && useradd --uid 1000 --gid usr_vscode --shell /bin/bash --create-home usr_vscode \
  # Show the contents of /etc/passwd
  && cat /etc/passwd

RUN echo "usr_vscode ALL=(root) NOPASSWD: ALL" > /etc/sudoers.d/usr_vscode_user_config && \
  chmod 0440 /etc/sudoers.d/usr_vscode_user_config


RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R usr_vscode /commandhistory

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/usr_vscode/.claude && \
  chown -R usr_vscode:usr_vscode /workspace /home/usr_vscode/.claude

WORKDIR /workspace

# https://github.com/dandavison/delta/releases
ARG GIT_DELTA_VERSION=0.18.2
RUN ARCH=$(dpkg --print-architecture) && \
  curl -L -o "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" "https://github.com/dandavison/delta/releases/download/${GIT_DELTA_VERSION}/git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  sudo dpkg -i "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb" && \
  rm "git-delta_${GIT_DELTA_VERSION}_${ARCH}.deb"

# Set up non-root user
USER usr_vscode

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh

# Set the default editor and visual
ENV EDITOR=nano
ENV VISUAL=nano

# https://github.com/deluan/zsh-in-docker/releases
# Default powerline10k theme
ENV POWERLEVEL9K_DISABLE_GITSTATUS=true
ARG ZSH_IN_DOCKER_VERSION=1.2.1
RUN touch /home/usr_vscode/.zshrc
RUN sh -c "$(curl -L -o - https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh)" -- \
  -p git \
  -p fzf \
  -a "source <(fzf --zsh)" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -x
  # -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
  # -a "source /usr/share/doc/fzf/examples/completion.zsh" \

# https://pnpm.io/installation#in-a-docker-container
ARG PNPM_HOME="/home/usr_vscode/.local/share/pnpm"
ARG PATH="$PNPM_HOME:$PATH"

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.zshrc" SHELL="$(which zsh)" zsh - \
  && pnpm --version \
  && pnpm env use lts --global

# Install Claude
RUN pnpm install -g \
  @google/gemini-cli@latest \
  @anthropic-ai/claude-code@latest \
  @musistudio/claude-code-router@latest
