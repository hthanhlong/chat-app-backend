import winston from 'winston'

const logger = (where: string) =>
  winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
      service: where
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.colorize({ all: true })
    ),
    transports: [new winston.transports.Console()]
  })

export default logger
