import morgan from 'morgan'
import LoggerService from '../core/services/LoggerService'

// Định nghĩa format log cho request
const stream = {
  write: (message: string) =>
    LoggerService.info({
      where: 'requestLogger',
      message: message.trim()
    })
}

// Middleware log request với Morgan + Winston
const requestLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream }
)

export default requestLogger
