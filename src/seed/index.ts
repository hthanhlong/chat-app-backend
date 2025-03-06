import AuthService from '../services/AuthService'
import UserService from '../services/UserService'
import logger from '../core/Logger'
const _logger = logger('seed')

const createMyAIAccount = async () => {
  const isExistMyAIAccount = await UserService.findUserByEmail('MyAI@gmail.com')

  if (isExistMyAIAccount) {
    _logger.info('createMyAIAccount was created')
    return
  }

  AuthService.signup({
    nickname: `I'm AI`,
    username: 'MyAI',
    email: 'MyAI@gmail.com',
    password: 'pjUl0Y+Ne62tvXvn',
    caption: 'I will help you'
  })

  _logger.info('createMyAIAccount is done')
}

export default createMyAIAccount
