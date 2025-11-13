// Minimal Vite ImportMeta type so TypeScript knows about import.meta.env variables
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
