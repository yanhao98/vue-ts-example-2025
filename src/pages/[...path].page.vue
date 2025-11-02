<script lang="ts" setup>
defineProps<{ path: string }>();

declare global {
  interface Window {
    stack?: ReturnType<typeof createStackGuard>;
  }
}

const stack = window?.stack;
const canGoBack = stack && stack.length > 1;
const router = useRouter();
function handleBack() {
  if (canGoBack) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>

<template>
  <main flex-1 class="flex flex-col items-center justify-center h-full space-y-4">
    <h1>Not Found</h1>
    <p>{{ path }} does not exist.</p>
    <Button @click="handleBack">{{ canGoBack ? 'Back' : 'Home' }}</Button>
  </main>
</template>

<route lang="yaml">
props: true
meta:
  layout: false
</route>
