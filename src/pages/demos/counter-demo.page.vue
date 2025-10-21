<script setup lang="ts">
import { ref } from 'vue';
import { NButton } from 'naive-ui';

// ========== 计数器模块 ==========
const clickCount = ref(0);

const incrementCount = () => {
  clickCount.value++;
};

const resetCount = () => {
  clickCount.value = 0;
};
</script>

<template>
  <div
    class="transition-all duration-500 p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 via-blue-50 dark:via-slate-800 to-slate-100 dark:to-gray-900 bg-gradient-to-br"
  >
    <div class="max-w-5xl mx-auto">
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
