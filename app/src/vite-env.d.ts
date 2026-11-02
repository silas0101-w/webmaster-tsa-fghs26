/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Express API, e.g. https://api.example.org. Empty string means same origin. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
