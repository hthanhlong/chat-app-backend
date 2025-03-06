import { port } from './config'
import app from './app'
import logger from './utils/logger'
const _logger = logger('server')

app
  .listen(port, () => _logger.info(`server running on port : ${port}`))
  .on('error', (e: Error) => _logger.error(e))
