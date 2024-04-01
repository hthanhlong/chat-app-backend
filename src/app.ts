import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit' // Import express-rate-limit
import Logger from './core/Logger'
import cors from 'cors'
import './database' // import database connection
// import './services/RedisService' // import RedisService
import './ws' // import websocket¬
import { environment, rateLimitOptions, urlConfigEncode } from './config'
import { ApiError } from './core/ApiError'
import routes from './routes'
import { handleNotFoundRoute } from './core/core'
import './seed'

process.on('uncaughtException', (e) => {
  Logger.error(e)
})

const app = express()

// middlewares
app.use(helmet())
const limiter = rateLimit(rateLimitOptions)
app.use(limiter)
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
      Logger.error(err.message)
      return res
    }
  }
})

export default app
