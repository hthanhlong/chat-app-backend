import express from 'express'
import { AuthController } from '../controller'
import {
  validateRefreshToken,
  validateAccessToken,
  validatorInput
} from '../../middlewares'
import { asyncHandler } from '../../helpers'
import { ValidationSchema } from '../../validation'

const authRouter = express.Router()

const authPaths = {
  signUp: '/sign-up',
  signIn: '/sign-in',
  refreshToken: '/refresh-token',
  signOut: '/sign-out',
  googleSignIn: '/google'
}

authRouter.post(
  authPaths.signUp,
  validatorInput(ValidationSchema.signUp),
  asyncHandler(AuthController.signUp)
)

authRouter.post(
  authPaths.signIn,
  validatorInput(ValidationSchema.signIn),
  asyncHandler(AuthController.signIn)
)

authRouter.post(
  authPaths.refreshToken,
  validatorInput(ValidationSchema.refreshToken),
  validateRefreshToken,
  asyncHandler(AuthController.refreshToken)
)

authRouter.post(
  authPaths.googleSignIn,
  validatorInput(ValidationSchema.googleSignIn),
  asyncHandler(AuthController.googleSignIn)
)

authRouter.get(
  authPaths.signOut,
  asyncHandler(validateAccessToken),
  asyncHandler(AuthController.signOut)
)

export default authRouter
