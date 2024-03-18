import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().required().min(3),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(6),
});
