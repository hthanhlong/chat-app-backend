// src/core/services/AuthService.test.ts
import AuthService from '../AuthService'
import { UserService, FriendShipService, JWTService } from '..'
import * as utils from '../../../utils'

jest.mock('..', () => ({
  UserService: {
    createUser: jest.fn(),
    findUserByEmail: jest.fn()
  },
  FriendShipService: {
    updateStatusFriend: jest.fn()
  },
  JWTService: {
    generateToken: jest.fn(),
    signAccessToken: jest.fn()
  }
}))

jest.mock('../../../utils', () => ({
  generateSalt: jest.fn(),
  hashPassword: jest.fn(),
  checkPassword: jest.fn()
}))

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('validatePassword', () => {
    it('should call checkPassword with correct params', async () => {
      ;(utils.checkPassword as jest.Mock).mockResolvedValue(true)
      const result = await AuthService.validatePassword('pw', 'hashed', 'salt')
      expect(utils.checkPassword).toHaveBeenCalledWith('pw', 'hashed', 'salt')
      expect(result).toBe(true)
    })
  })

  describe('signIn', () => {
    it('should return null if name is missing', async () => {
      const result = await AuthService.signIn({
        id: 1,
        name: '',
        uuid: 'u',
        nickName: 'n'
      })
      expect(result).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('should return new access token', async () => {
      ;(JWTService.signAccessToken as jest.Mock).mockReturnValue('new-access')
      const payload = { id: 1, name: 'user', uuid: 'uuid', nickName: 'nick' }
      const result = await AuthService.refreshToken(payload as any)
      expect(JWTService.signAccessToken).toHaveBeenCalledWith(payload)
      expect(result).toBe('new-access')
    })
  })
})
