// Mapper for environment variables
export const environment = process.env.NODE_ENV
export const port = process.env.PORT
export const timezone = process.env.TZ
export const logDirectory = process.env.LOG_DIR

export const db = {
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PWD || '',
  name: process.env.DB_NAME || '',
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10')
}

export const redisUrl = process.env.REDIS_URL || 'redis://54.219.186.74:6379'

export const urlConfigEncode = {
  limit: '10mb',
  extended: true,
  parameterLimit: 50000
}

export const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS || 'secret'
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || 'secret123'
export const ACCESS_TOKEN_TIME =
  process.env.ACCESS_TOKEN_VALIDITY_SEC || 1800000 // 30 minutes
export const REFRESH_TOKEN_TIME =
  process.env.REFRESH_TOKEN_VALIDITY_SEC || '90d' // 90 days

export const rateLimitOptions = {
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 200, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
}
