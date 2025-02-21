declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_URI: string;
    FRONTEND_URL?: string;
  }
}
