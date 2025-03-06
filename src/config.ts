// Mapper for environment variables
import dotenv from 'dotenv'
dotenv.config()

export const environment = process.env.NODE_ENV
export const port = process.env.PORT
export const timezone = process.env.TZ
export const logDirectory = process.env.LOG_DIR

export const db = {
  user: process.env.MONGO_INITDB_ROOT_USERNAME || '',
  password: process.env.MONGO_INITDB_ROOT_PASSWORD || '',
  dbName: process.env.MONGO_DB_NAME || ''
}

export const mongoUrl = `mongodb://${db.user}:${db.password}@localhost:27017/${db.dbName}?authsource=admin`

export const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

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

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
export const PASSWORD_KEY = process.env.PASSWORD_KEY || ''
