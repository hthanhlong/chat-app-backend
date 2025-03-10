import { model, Schema } from 'mongoose'

export const DOCUMENT_NAME = 'Message'
export const COLLECTION_NAME = 'messages' // display on database

export interface IMessage {
  senderId: string
  receiverId: string
  message: string
  file: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.String,
      ref: 'User'
    },
    receiverId: {
      type: Schema.Types.String,
      ref: 'User'
    },
    message: {
      type: Schema.Types.String
    },
    file: {
      type: Schema.Types.String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const MessageModel = model<IMessage>(DOCUMENT_NAME, schema, COLLECTION_NAME)

export default MessageModel
