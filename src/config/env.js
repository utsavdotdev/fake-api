import 'dotenv/config';

const env = {
  port: parseInt(process.env.PORT, 10) || 3000,
  defaultPageLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 10,
  maxDelayMs: parseInt(process.env.MAX_DELAY_MS, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;