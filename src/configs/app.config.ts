import 'dotenv/config';

const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    dbName: process.env.DB_NAME || 'test',
    debug: true,
  },
};

export default config;
