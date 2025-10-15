declare global {
  const __DEV__: boolean;
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    __DEV__: boolean;
  }
}
