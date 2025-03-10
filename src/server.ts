import express from 'express'
import logger from './utils/logger'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'
import { handleNotFoundRoute, limiter, errorHandler } from './core/middlewares'
import envConfig from './config'
import Database from './database'
import WebSocketInstance from './ws'
const _logger = logger('server')

const app = express()
Database.init()
WebSocketInstance.init()
app.use(helmet())
app.use(cors({ origin: envConfig.CORS_URL }))
app.use(express.json({ limit: envConfig.JSON_LIMIT }))
app.use(express.urlencoded(envConfig.URL_CONFIG_ENCODE))
app.use(limiter())
app.use('/api/v1', routes)
app.use(handleNotFoundRoute)
app.use(errorHandler)
app.listen(envConfig.APP_PORT, () =>
  _logger.info(`server running on port : ${envConfig.APP_PORT}`)
)
