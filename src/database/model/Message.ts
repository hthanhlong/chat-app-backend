import { model, Schema } from 'mongoose'

export const DOCUMENT_NAME = 'Message'
export const COLLECTION_NAME = 'messages' // display on database

const schema = new Schema<Message>(
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

export default model<Message>(DOCUMENT_NAME, schema, COLLECTION_NAME)
