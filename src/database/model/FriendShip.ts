import { model, Schema } from 'mongoose'

export const DOCUMENT_NAME = 'FriendShip'
export const COLLECTION_NAME = 'friendships' // display on database

const schema = new Schema<FriendShip>(
  {
    senderId: {
      type: Schema.Types.String,
      ref: 'User'
    },
    receiveId: {
      type: Schema.Types.String,
      ref: 'User'
    },
    status: {
      type: Schema.Types.String,
      ref: 'FriendStatus'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

schema.index({ senderId: 1, receiveId: 1 }, { unique: true })

export default model<FriendShip>(DOCUMENT_NAME, schema, COLLECTION_NAME)
