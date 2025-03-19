import winston from 'winston'
import { IRequest } from '../types'
import path from 'path'

/*
  Todo list:
  - add log central
  - add estimate time request
*/

const logger = (where: string) => (req: IRequest | null) =>
  winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    defaultMeta: {
      service: where,
      traceId: req?.traceId
    },
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.json(),
      winston.format.colorize({ all: true })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(__dirname, '../../logs/app.log'), // Log to file
        level: 'info',
        maxsize: 5 * 1024 * 1024, // Max file size: 5MB
        maxFiles: 5, // Keep last 5 log files
        tailable: true // Keep writing to the latest file
      })
    ]
  })

export default logger
