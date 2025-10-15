<script lang="ts" setup>
defineProps<{ path: string }>();
</script>
<template>
  <main flex-1 class="flex flex-col items-center justify-center h-full space-y-4">
    <h1>Not Found</h1>
    <p>{{ path }} does not exist.</p>
    <Button @click="$router.back()">Back</Button>
  </main>
</template>

<route lang="yaml">
props: true
meta:
  layout: false
</route>
