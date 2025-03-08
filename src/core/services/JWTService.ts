import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import envConfig from '../../config'
import { JWT_PAYLOAD } from '../../types'
import {
  BadTokenError,
  AccessTokenExpired,
  InternalError
} from '../../utils/httpExceptions'

class JWTService {
  generateToken = (payload: JWT_PAYLOAD) => {
    const accessToken = this.signAccessToken(payload)
    const refreshToken = this.signRefreshToken(payload)
    return { accessToken, refreshToken }
  }

  signAccessToken(payload: JWT_PAYLOAD) {
    return jwt.sign(payload, envConfig.JWT_SECRET_ACCESS, {
      expiresIn: envConfig.ACCESS_TOKEN_TIME
    })
  }

  signRefreshToken(payload: JWT_PAYLOAD) {
    return jwt.sign(payload, envConfig.JWT_SECRET_REFRESH, {
      expiresIn: envConfig.REFRESH_TOKEN_TIME
    })
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, envConfig.JWT_SECRET_ACCESS) as JWT_PAYLOAD
  }

  verifyRefreshToken(token: string): JWT_PAYLOAD {
    return jwt.verify(token, envConfig.JWT_SECRET_REFRESH) as JWT_PAYLOAD
  }
}
export default new JWTService()
