interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  DISCORD_WEBHOOK_URL: string;
}

declare namespace NodeJS {
  interface ProcessEnv extends CloudflareEnv {}
}
