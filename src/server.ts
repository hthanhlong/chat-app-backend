import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import routes from './core/routes'
import envConfig from './config'
// import WebSocketService from './ws'
import { RedisService, KafkaService, LoggerService } from './core/services'
import {
  handleNotFoundRoute,
  limiter,
  errorHandler,
  LocalStorage,
  requestLogger,
  checkDatabaseConnection
} from './middlewares'

async function main() {
  const APP_PORT = envConfig.APP_PORT
  const app = express()
  LoggerService.initLogger()
  await checkDatabaseConnection()
  KafkaService.init()
  RedisService.initPub()
  RedisService.initSub()
  // WebSocketService.init()
  app.use(helmet())
  app.use(cors(envConfig.CORS_OPTIONS))
  app.use(express.json({ limit: envConfig.JSON_LIMIT }))
  app.use(express.urlencoded(envConfig.URL_CONFIG_ENCODE))
  app.use(limiter())
  app.use(LocalStorage.middleware)
  app.use(requestLogger)
  app.use(compression())
  app.use('/api/v1', routes)
  app.use(handleNotFoundRoute)
  app.use(errorHandler)
  app.listen(APP_PORT, () =>
    LoggerService.info({
      where: 'server',
      message: `server running on port: ${APP_PORT}`
    })
  )
  process.removeAllListeners('warning') // todo: remove this

  process.on('SIGINT', async () => {
    LoggerService.info({
      where: 'server',
      message: 'Server is shutting down'
    })
    RedisService.disconnect()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    LoggerService.info({
      where: 'server',
      message: 'Server is shutting down'
    })
    RedisService.disconnect()
    process.exit(0)
  })
}

main()
