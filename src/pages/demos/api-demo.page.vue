<script setup lang="ts">
import { ref } from 'vue';

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
</script>

<template>
  <div
    class="transition-all duration-500 p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 via-blue-50 dark:via-slate-800 to-slate-100 dark:to-gray-900 bg-gradient-to-br"
  >
    <div class="max-w-5xl mx-auto">
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
          <h3 class="font-semibold mb-2 flex items-center text-sm text-gray-700 dark:text-gray-200">
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
    </div>
  </div>
</template>
