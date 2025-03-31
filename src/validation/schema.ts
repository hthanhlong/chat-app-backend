import Joi from 'joi'

class ValidationSchema {
  static signUp = Joi.object({
    caption: Joi.string().max(1000).optional(),
    nickName: Joi.string().required().min(3).max(64),
    username: Joi.string().required().min(3).max(64),
    email: Joi.string().required().email().max(100),
    password: Joi.string().required().min(6).max(64)
  })

  static signIn = Joi.object({
    username: Joi.string().required().min(3).max(64),
    password: Joi.string().required().min(6).max(64)
  })

  static addFriend = Joi.object({
    receiverUuid: Joi.string().required(),
    status: Joi.string().required()
  })

  static refreshToken = Joi.object({
    refreshToken: Joi.string().required()
  })

  static userUpdate = Joi.object({
    caption: Joi.string().max(1000).optional(),
    nickName: Joi.string().required().min(3).max(64).optional()
  })

  static googleSignIn = Joi.object({
    credential: Joi.string().required(),
    clientId: Joi.string().required(),
    select_by: Joi.string().required()
  })

  static updateFriendStatus = Joi.object({
    receiverUuid: Joi.string().required(),
    status: Joi.string().required()
  })

  static deleteAllMessage = Joi.object({
    friendUuid: Joi.string().required()
  })
}

export default ValidationSchema
