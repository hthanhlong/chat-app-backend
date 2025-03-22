import express from 'express'
import { MessageController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken, validatorInput } from '../../middlewares'
import { deleteAllMessageSchema } from '../../validation'

const messageRouter = express.Router()

const messagePaths = {
  getMessages: '/:friendId',
  getLatestMessage: '/:friendId/latest-message',
  deleteAllMessage: '/delete-all-message'
}

messageRouter.use(asyncHandler(validateAccessToken))

messageRouter.get(
  messagePaths.getMessages,
  asyncHandler(MessageController.getMessages)
)
messageRouter.get(
  messagePaths.getLatestMessage,
  asyncHandler(MessageController.getLatestMessage)
)
messageRouter.post(
  messagePaths.deleteAllMessage,
  validatorInput(deleteAllMessageSchema),
  asyncHandler(MessageController.deleteAllMessage)
)

export default messageRouter
