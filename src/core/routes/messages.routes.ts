import express from 'express'
import { MessageController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken, validatorInput } from '../../middlewares'
import { ValidationSchema } from '../../validation'
import { UtilsService } from '../services'
const messageRouter = express.Router()

const messagePaths = {
  getMessages: '/:friendUuid',
  getLatestMessage: '/:friendUuid/latest-message',
  deleteAllMessage: '/delete-all-message',
  uploadFile: '/upload-file'
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
  validatorInput(ValidationSchema.deleteAllMessage),
  asyncHandler(MessageController.deleteAllMessage)
)

messageRouter.post(
  messagePaths.uploadFile,
  UtilsService.getMulter().single('file'),
  asyncHandler(MessageController.uploadFile)
)

export default messageRouter
