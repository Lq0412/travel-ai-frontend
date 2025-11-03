/// <reference types="vite/client" />

declare module 'marked' {
  export const marked: {
    setOptions: (options: any) => void
    parse: (src: string) => string
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
