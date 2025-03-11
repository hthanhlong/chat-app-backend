import express from 'express'
import logger from './utils/logger'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'
import { handleNotFoundRoute, limiter, errorHandler } from './core/middlewares'
import envConfig from './config'
import Database from './database'
import WebSocketService from './ws'
import RedisService from './redis'

const _logger = logger('server')
const APP_PORT = envConfig.APP_PORT
const app = express()
Database.init()
WebSocketService.init()
RedisService.init()
app.use(helmet())
app.use(cors({ origin: envConfig.CORS_URL }))
app.use(express.json({ limit: envConfig.JSON_LIMIT }))
app.use(express.urlencoded(envConfig.URL_CONFIG_ENCODE))
app.use(limiter())
app.use('/api/v1', routes)
app.use(handleNotFoundRoute)
app.use(errorHandler)
app.listen(APP_PORT, () => _logger.info(`server running on port : ${APP_PORT}`))
process.removeAllListeners('warning') // todo: remove this

process.on('SIGINT', async () => {
  _logger.info('Server is shutting down')
  await Database.close()
  RedisService.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  _logger.info('Server is shutting down')
  await Database.close()
  RedisService.disconnect()
  process.exit(0)
})
