/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_V1_ENDPOINT: string;
	readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
