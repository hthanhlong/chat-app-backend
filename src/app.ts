import express, { Request, Response, NextFunction } from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import './database' // import database connection
import './services/RedisService' // import redis service
import './ws' // import websocket
import { environment, urlConfigEncode } from './config'
import { ApiError } from './core/ApiError'
import routes from './routes'
import { handleNotFoundRoute } from './core/core'

process.on('uncaughtException', (e) => {
  Logger.error(e)
})

const app = express()
// middlewares
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded(urlConfigEncode))
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))
//routes
app.use('/api/v1', routes)
app.use(handleNotFoundRoute)
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      isSuccess: false,
      errorCode: err.type,
      message: err.message,
      data: null
    })
  } else {
    if (environment === 'development') {
      Logger.error(err)
      return res
    }
  }
})

export default app
