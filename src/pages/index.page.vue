<script setup lang="ts">
import { ref } from 'vue';

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
  <div class="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3">
    <div class="bg-white rounded-lg shadow-md p-4 max-w-xs w-full">
      <h1 class="text-xl font-bold text-gray-800 mb-3 text-center">API 示例</h1>

      <button
        @click="callApi"
        :disabled="loading"
        class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-1.5 px-3 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-sm text-sm"
      >
        {{ loading ? '调用中...' : '调用 API' }}
      </button>

      <div v-if="apiResult" class="mt-3 bg-gray-50 rounded-md p-2">
        <h3 class="text-gray-700 font-semibold mb-1.5 text-xs">响应结果:</h3>
        <pre class="text-gray-600 text-xs overflow-x-auto">{{ apiResult }}</pre>
      </div>
    </div>
  </div>
</template>
