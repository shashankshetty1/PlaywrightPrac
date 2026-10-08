/// <reference types="vite/client" />

// Public, build-time settings (safe to expose — never put secrets in VITE_* variables).
interface ImportMetaEnv {
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_UMAMI_SCRIPT_URL?: string;
  readonly VITE_UMAMI_DOMAINS?: string;
  readonly VITE_VISIT_NOTIFY?: string;
  readonly VITE_VISIT_NOTIFY_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
