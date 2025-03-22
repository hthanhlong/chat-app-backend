import winston from 'winston'
import { IRequest } from '../types'
import path from 'path'
import DailyRotateFile from 'winston-daily-rotate-file'
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
      new DailyRotateFile({
        filename: path.join(__dirname, `../../logs/app.log`), // Log to file
        level: 'info',
        maxSize: '20m', // Max file size: 20MB
        maxFiles: '14d' // Keep last 14 days log files
      })
    ]
  })

export default logger
