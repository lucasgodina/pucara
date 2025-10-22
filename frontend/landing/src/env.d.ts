/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MERCADOPAGO_ACCESS_TOKEN: string;
  readonly MERCADOPAGO_PUBLIC_KEY: string;
  readonly NGROK_URL?: string;
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASS?: string;
  readonly RECAPTCHA_SECRET_KEY?: string;
  readonly NODE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
