import rateLimit from 'express-rate-limit'
import envConfig from '../config'

const limiter = () => rateLimit(envConfig.RATE_LIMIT_OPTIONS)
export default limiter
