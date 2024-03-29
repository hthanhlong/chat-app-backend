import AuthService from '../services/AuthService'
import UserService from '../services/UserService'

const createMyAIAccount = async () => {
  const isExistMyAIAccount = await UserService.findUserByEmail('MyAI@gmail.com')

  if (isExistMyAIAccount) {
    console.log('createMyAIAccount was created')
    return
  }

  AuthService.signup({
    nickname: `I'm AI`,
    username: 'MyAI',
    email: 'MyAI@gmail.com',
    password: 'pjUl0Y+Ne62tvXvn',
    caption: 'I will help you'
  })

  console.log('createMyAIAccount is done')
}

createMyAIAccount()
