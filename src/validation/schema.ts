import Joi from 'joi'

export const signUpSchema = Joi.object({
  caption: Joi.string().max(1000).optional(),
  nickname: Joi.string().required().min(3).max(64),
  username: Joi.string().required().min(3).max(64),
  email: Joi.string().required().email().max(100),
  password: Joi.string().required().min(6).max(64)
})

export const signInSchema = Joi.object({
  username: Joi.string().required().min(3).max(64),
  password: Joi.string().required().min(6).max(64)
})

export const addFriendSchema = Joi.object({
  receiverId: Joi.string().required(),
  status: Joi.string().required()
})

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})

export const userUpdateSchema = Joi.object({
  caption: Joi.string().max(1000).optional(),
  nickname: Joi.string().required().min(3).max(64).optional()
})

export const googleSignInSchema = Joi.object({
  credential: Joi.string().required(),
  clientId: Joi.string().required(),
  select_by: Joi.string().required()
})

export const signOutSchema = Joi.object({
  id: Joi.string().required()
})

export const updateFriendStatusSchema = Joi.object({
  receiverId: Joi.string().required(),
  status: Joi.string().required()
})

export const deleteAllMessageSchema = Joi.object({
  friendId: Joi.string().required()
})
