import express from 'express'
import logger from './utils/logger'
import helmet from 'helmet'
import cors from 'cors'
import routes from './core/routes'
import { handleNotFoundRoute, limiter, errorHandler } from './middlewares'
import envConfig from './config'
import Database from './database'
import WebSocketService from './ws'
import RedisService from './core/services/RedisService'

const _logger = logger('server')

async function main() {
  if (!envConfig.IS_LOAD_ENV) {
    _logger(null).error('Loading environment variables failed')
    process.exit(1)
  } else {
    _logger(null).info('Environment variables loaded successfully')
  }
  const APP_PORT = envConfig.APP_PORT
  const app = express()
  await Database.init()
  RedisService.initPub()
  RedisService.initSub()
  WebSocketService.init()
  app.use(helmet())
  app.use(cors({ origin: envConfig.CORS_URL }))
  app.use(express.json({ limit: envConfig.JSON_LIMIT }))
  app.use(express.urlencoded(envConfig.URL_CONFIG_ENCODE))
  app.use(limiter())
  app.use('/api/v1', routes)
  app.use(handleNotFoundRoute)
  app.use(errorHandler)
  app.listen(APP_PORT, () =>
    _logger(null).info(`server running on port: ${APP_PORT}`)
  )
  process.removeAllListeners('warning') // todo: remove this

  process.on('SIGINT', async () => {
    _logger(null).info('Server is shutting down')
    await Database.close()
    RedisService.disconnect()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    _logger(null).info('Server is shutting down')
    await Database.close()
    RedisService.disconnect()
    process.exit(0)
  })
}

main()
