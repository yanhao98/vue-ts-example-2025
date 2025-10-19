<script setup lang="ts">
import { ref, onUnmounted, computed, nextTick } from 'vue';
import { NButton } from 'naive-ui';

// ========== API 模块 ==========
const apiResult = ref<string>('');
const loading = ref(false);

const callApi = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/');
    const data = await response.json();
    apiResult.value = JSON.stringify(data, null, 2);
  } catch (error) {
    apiResult.value = `Error: ${error}`;
  } finally {
    loading.value = false;
  }
};

// ========== WebSocket 模块 ==========
const ws = ref<WebSocket | null>(null);
const wsConnected = ref(false);
const wsMessages = ref<string[]>([]);
const messageInput = ref('');
const wsLoading = ref(false);
const connectionAttempts = ref(0);
const maxReconnectAttempts = 3;
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const connectWebSocket = async () => {
  if (ws.value?.readyState === WebSocket.OPEN) return;

  wsLoading.value = true;
  connectionAttempts.value++;

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = (event) => {
      console.log('[onopen] event :>> ', event);
      wsConnected.value = true;
      wsLoading.value = false;
      connectionAttempts.value = 0;
      wsMessages.value.push(`✅ WebSocket连接已建立 (${new Date().toLocaleTimeString()})`);
      scrollToBottom();
    };

    ws.value.onmessage = (event) => {
      console.log('[onmessage] event :>> ', event);
      wsMessages.value.push(`📨 收到: ${event.data}`);
      scrollToBottom();
    };

    ws.value.onclose = (event) => {
      console.log('[onclose] event :>> ', event);
      wsConnected.value = false;
      wsLoading.value = false;
      const reason = event.reason || '连接意外断开';
      wsMessages.value.push(
        `❌ WebSocket连接已关闭: ${reason} (${new Date().toLocaleTimeString()})`,
      );
      scrollToBottom();

      if (connectionAttempts.value < maxReconnectAttempts && !event.wasClean) {
        setTimeout(() => {
          wsMessages.value.push(
            `🔄 尝试重新连接 (${connectionAttempts.value}/${maxReconnectAttempts})...`,
          );
          scrollToBottom();
          connectWebSocket();
        }, 2000);
      }
    };

    ws.value.onerror = (error) => {
      console.error('[onerror] error :>> ', error);
      wsLoading.value = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      wsMessages.value.push(
        `⚠️ WebSocket连接错误: ${errorMessage} (${new Date().toLocaleTimeString()})`,
      );
      scrollToBottom();
    };
  } catch {
    wsLoading.value = false;
    wsMessages.value.push(`❌ 连接失败 (${new Date().toLocaleTimeString()})`);
    scrollToBottom();
  }
};

const disconnectWebSocket = () => {
  if (ws.value) {
    ws.value.close(4000, '用户主动断开连接');
    ws.value = null;
  }
};

const sendMessage = () => {
  if (ws.value?.readyState === WebSocket.OPEN && messageInput.value.trim()) {
    const message = messageInput.value.trim();
    ws.value.send(message);
    wsMessages.value.push(`🚀 发送: ${message} (${new Date().toLocaleTimeString()})`);
    messageInput.value = '';
    scrollToBottom();
  }
};

const sendMockData = () => {
  if (ws.value?.readyState === WebSocket.OPEN) {
    const mockMessages = [
      '你好，这是一条测试消息',
      'WebSocket 连接正常',
      '实时通信功能演示',
      '模拟数据发送成功',
      'Hello World!',
      '这是一条中文消息',
      '实时数据传输测试',
      'WebSocket 功能验证',
    ];

    const randomIndex = Math.floor(Math.random() * mockMessages.length);
    const randomMessage = mockMessages[randomIndex]!;
    ws.value.send(randomMessage);
    wsMessages.value.push(`🚀 发送: ${randomMessage} (${new Date().toLocaleTimeString()})`);
    scrollToBottom();
  }
};

const clearMessages = async () => {
  wsMessages.value = [];
  await scrollToBottom();
};

const exportMessages = () => {
  const dataStr = JSON.stringify(wsMessages.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `websocket-messages-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ========== 计数器模块 ==========
const clickCount = ref(0);

const incrementCount = () => {
  clickCount.value++;
};

const resetCount = () => {
  clickCount.value = 0;
};

// ========== 计算属性 ==========
const canSendMessage = computed(() => wsConnected.value && messageInput.value.trim());
const connectionStatusText = computed(() => {
  if (wsLoading.value) return '连接中...';
  if (wsConnected.value) return '已连接';
  return '未连接';
});

// ========== 生命周期钩子 ==========
onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<template>
  <div
    class="transition-all duration-500 p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 via-blue-50 dark:via-slate-800 to-slate-100 dark:to-gray-900 bg-gradient-to-br"
  >
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- API 调用示例 -->
        <div
          class="backdrop-blur-sm rounded-2xl shadow-lg border p-4 sm:p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group bg-white dark:bg-gray-800 border-white dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
        >
          <div class="flex items-center mb-3">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">API 调用示例</h2>
          </div>

          <button
            @click="callApi"
            :disabled="loading"
            :aria-label="loading ? '正在调用API' : '调用API接口'"
            class="w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-sm"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              调用中...
            </span>
            <span v-else>调用 API</span>
          </button>

          <div
            v-if="apiResult"
            class="mt-4 rounded-lg p-4 border bg-gray-50 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-gray-100 dark:to-gray-700"
          >
            <h3
              class="font-semibold mb-2 flex items-center text-sm text-gray-700 dark:text-gray-200"
            >
              <svg
                class="w-4 h-4 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              响应结果:
            </h3>
            <pre
              class="text-sm overflow-x-auto p-3 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600"
              >{{ apiResult }}</pre
            >
          </div>
        </div>

        <!-- WebSocket 示例 -->
        <div
          class="backdrop-blur-sm rounded-2xl shadow-lg border p-4 sm:p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group bg-white dark:bg-gray-800 border-white dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
        >
          <div class="flex items-center mb-4">
            <div
              class="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-2"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 18.5V6M9 9l3-3 3 3m-3 9l3 3-3 3"
                />
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">WebSocket 示例</h2>
          </div>

          <!-- 连接状态和控制按钮 -->
          <div class="mb-4">
            <!-- 连接状态显示 -->
            <div
              class="flex items-center justify-between mb-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700"
              role="status"
              aria-live="polite"
              aria-label="WebSocket连接状态"
            >
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div
                    class="w-4 h-4 rounded-full transition-all duration-500 shadow-lg"
                    :class="
                      wsConnected
                        ? 'bg-gradient-to-br from-green-400 to-green-600 animate-pulse'
                        : 'bg-gradient-to-br from-red-400 to-red-600'
                    "
                  />
                  <div
                    v-if="wsLoading"
                    class="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-ping"
                  />
                  <div
                    v-if="wsConnected"
                    class="absolute inset-0 w-4 h-4 rounded-full bg-green-400 animate-ping opacity-20"
                  />
                </div>
                <div>
                  <div class="font-medium text-gray-800 dark:text-gray-100">
                    {{ connectionStatusText }}
                  </div>
                  <div
                    v-if="connectionAttempts > 0"
                    class="text-xs text-gray-500 dark:text-gray-300"
                  >
                    重连次数: {{ connectionAttempts }}/{{ maxReconnectAttempts }}
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-300">
                {{ wsConnected ? '🟢 实时通信' : wsLoading ? '🟡 连接中' : '🔴 未连接' }}
              </div>
            </div>

            <!-- 控制按钮 -->
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="connectWebSocket"
                :disabled="wsConnected || wsLoading"
                :aria-label="
                  wsLoading
                    ? '正在连接WebSocket'
                    : wsConnected
                      ? 'WebSocket已连接'
                      : '连接WebSocket'
                "
                class="flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-sm"
              >
                <svg
                  v-if="wsLoading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{{ wsLoading ? '连接中...' : '连接' }}</span>
              </button>

              <button
                @click="disconnectWebSocket"
                :disabled="!wsConnected || wsLoading"
                :aria-label="!wsConnected ? 'WebSocket未连接' : '断开WebSocket连接'"
                class="flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-red-600 hover:via-red-700 hover:to-pink-700 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                断开
              </button>
            </div>
          </div>

          <!-- 发送消息 -->
          <div class="mb-4">
            <div class="flex gap-2">
              <label class="sr-only" for="messageInput">要发送的消息</label>
              <input
                id="messageInput"
                v-model="messageInput"
                @keyup.enter="sendMessage"
                placeholder="输入要发送的消息..."
                :disabled="!wsConnected"
                :aria-describedby="!wsConnected ? 'ws-status' : undefined"
                class="flex-1 w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 transition-all duration-300 border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-800 dark:text-gray-100 disabled:bg-gray-100/60 dark:disabled:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-500"
              />
              <button
                @click="sendMessage"
                :disabled="!canSendMessage"
                :aria-label="
                  !wsConnected ? 'WebSocket未连接' : canSendMessage ? '发送消息' : '请输入消息内容'
                "
                class="flex items-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-sm"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                发送
              </button>
              <button
                @click="sendMockData"
                :disabled="!wsConnected"
                :aria-label="!wsConnected ? 'WebSocket未连接' : '发送随机模拟数据'"
                class="flex items-center bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-purple-600 hover:via-purple-700 hover:to-violet-700 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-sm"
                :title="!wsConnected ? 'WebSocket未连接时不可用' : '发送随机模拟数据'"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                模拟
              </button>
            </div>
          </div>

          <!-- 消息记录 -->
          <div
            class="rounded-lg p-3 border bg-gray-50 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-gray-100 dark:to-gray-700"
            role="log"
            aria-label="WebSocket消息记录"
            aria-live="polite"
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-gray-700 dark:text-gray-200 font-semibold flex items-center text-sm">
                <svg
                  class="w-4 h-4 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                消息记录:
              </h3>
              <div class="flex gap-1">
                <button
                  @click="exportMessages"
                  class="text-xs text-gray-500 hover:text-blue-500 transition-colors duration-200 flex items-center"
                  title="导出消息"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l4-4m-4 4l-4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  导出
                </button>
                <button
                  @click="clearMessages"
                  class="text-xs text-gray-500 hover:text-red-500 transition-colors duration-200 flex items-center"
                  title="清空消息"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  清空
                </button>
              </div>
            </div>
            <div
              ref="messagesContainer"
              class="max-h-48 overflow-y-auto rounded-lg border p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            >
              <div
                v-if="wsMessages.length === 0"
                class="text-gray-500 dark:text-gray-400 text-sm text-center py-6"
              >
                <svg
                  class="w-6 h-6 mx-auto mb-1 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                暂无消息
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="(message, index) in wsMessages"
                  :key="index"
                  class="text-sm p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in"
                  :class="
                    message.includes('发送:')
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-200 border-l-4 border-blue-400 dark:border-blue-500'
                      : message.includes('收到:')
                        ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-200 border-l-4 border-green-400 dark:border-green-500'
                        : message.includes('连接已建立')
                          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 text-emerald-800 dark:text-emerald-200 border-l-4 border-emerald-400 dark:border-emerald-500'
                          : message.includes('连接已关闭') || message.includes('连接失败')
                            ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-200 border-l-4 border-red-400 dark:border-red-500'
                            : message.includes('尝试重新连接')
                              ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-200 border-l-4 border-yellow-400 dark:border-yellow-500'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-l-4 border-gray-400 dark:border-gray-500'
                  "
                >
                  {{ message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 计数器示例 -->
      <div
        class="mt-4 sm:mt-6 backdrop-blur-sm rounded-2xl shadow-lg border p-4 sm:p-5 bg-white dark:bg-gray-800 border-white dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
      >
        <div class="mb-4">
          <div class="flex items-center mb-2">
            <div
              class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-2"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">点击计数器</h2>
          </div>

          <!-- 说明文字 -->
          <div
            class="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
          >
            <div class="flex items-start">
              <svg
                class="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <span class="font-semibold text-blue-700 dark:text-blue-300">测试说明：</span>
                <span class="text-gray-700 dark:text-gray-300"
                  >用于测试移动端连点和页面缩放对按钮点击事件的影响</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center space-y-4">
          <!-- 计数显示 -->
          <div
            class="w-full p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-200 dark:border-orange-700"
          >
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">当前点击次数</div>
              <div
                class="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
              >
                {{ clickCount }}
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="w-full flex flex-col gap-3">
            <!-- 原生按钮 (带 touch 事件) -->
            <button
              @touchstart="() => {}"
              @touchend="() => {}"
              @click="incrementCount"
              class="w-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-700 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-lg"
            >
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                点击 +1 (带 touch)
              </span>
            </button>

            <!-- 原生按钮 (无 touch 事件) -->
            <button
              @click="incrementCount"
              class="w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-lg"
            >
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                点击 +1 (无 touch)
              </span>
            </button>

            <!-- Naive UI 按钮 -->
            <n-button
              @click="incrementCount"
              type="warning"
              size="large"
              block
              strong
              secondary
              class="text-lg"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </template>
              点击 +1 (Naive UI)
            </n-button>

            <!-- 重置按钮 -->
            <button
              @click="resetCount"
              :disabled="clickCount === 0"
              class="w-full bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 transition-all duration-500 disabled:opacity-50 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                重置计数器
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
