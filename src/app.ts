import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit' // Import express-rate-limit
import cors from 'cors'
import './ws' // import websocket¬
import { environment, rateLimitOptions, urlConfigEncode } from './config'
import { ApiError } from './utils/httpExceptions'
import routes from './routes'
import { handleNotFoundRoute } from './utils/index'
import connectDB from './database'
import logger from './utils/logger'
const _logger = logger('app')

const app = express()
connectDB()
const limiter = rateLimit(rateLimitOptions)
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded(urlConfigEncode))
app.use(cors())
app.use(helmet())
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
      _logger.error(err.message)
      return res
    }
  }
})

export default app
