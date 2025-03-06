import logger from './core/Logger'
import { port } from './config'
import app from './app'

const _logger = logger('server')

app
  .listen(port, () => _logger.info(`server running on port : ${port}`))
  .on('error', (e: Error) => _logger.error(e))
