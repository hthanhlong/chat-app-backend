import express from 'express'
import { AuthController } from '../controller'
import {
  validateRefreshToken,
  validateAccessToken,
  validatorInput
} from '../../middlewares'
import { asyncHandler } from '../../helpers'
import {
  signUpSchema,
  signInSchema,
  googleSignInSchema,
  refreshTokenSchema
} from '../../validation'

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
  validatorInput(signUpSchema),
  asyncHandler(AuthController.signUp)
)

authRouter.post(
  authPaths.signIn,
  validatorInput(signInSchema),
  asyncHandler(AuthController.signIn)
)

authRouter.post(
  authPaths.refreshToken,
  validatorInput(refreshTokenSchema),
  validateRefreshToken,
  asyncHandler(AuthController.refreshToken)
)

authRouter.post(
  authPaths.googleSignIn,
  validatorInput(googleSignInSchema),
  asyncHandler(AuthController.googleSignIn)
)

authRouter.get(
  authPaths.signOut,
  validateAccessToken,
  asyncHandler(AuthController.signOut)
)

export default authRouter
