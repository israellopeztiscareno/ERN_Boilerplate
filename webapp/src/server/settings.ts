export default {
  DEV_HOST: "localhost",
  DEV_PORT: 3000,
  DEV_ASSETS_HOST: "localhost",
  DEV_ASSETS_PORT: 3001,
  PROD_HOST: "localhost",
  PROD_PORT: 3000,
  PROD_ASSETS_HOST: "localhost",
  PROD_ASSETS_POST: 3001,

  KEYCLOAC_HOST: process.env.KEYCLOAC_HOST,
  KEYCLOAC_PORT: Number(process.env.KEYCLOAC_PORT),
  KEYCLOAC_PROTOCOL: process.env.KEYCLOAC_PROTOCOL as "http:" | "https:",

  USERS_HOST: process.env.USERS_HOST,
  USERS_PORT: Number(process.env.USERS_PORT),
  USERS_PROTOCOL: process.env.USERS_PROTOCOL as "http:" | "https:",

  DOCUMENTS_HOST: process.env.DOCUMENTS_HOST,
  DOCUMENTS_PORT: Number(process.env.DOCUMENTS_PORT),
  DOCUMENTS_PROTOCOL: process.env.DOCUMENTS_PROTOCOL as "http:" | "https:",
};
