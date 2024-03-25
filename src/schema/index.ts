import Joi from 'joi';

export const signupSchema = Joi.object({
  caption: Joi.string().max(1000).optional(),
  nickname: Joi.string().required().min(3).max(64),
  username: Joi.string().required().min(3).max(64),
  email: Joi.string().required().email().max(100),
  password: Joi.string().required().min(6).max(64),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(64),
  password: Joi.string().required().min(6).max(64),
});

export const sendFriendRequestSchema = Joi.object({
  senderId: Joi.string().required(),
  receiverId: Joi.string().required(),
  status: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
