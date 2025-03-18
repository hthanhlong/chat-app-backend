import { model, Schema } from 'mongoose'
export const DOCUMENT_NAME = 'FriendShip'
export const COLLECTION_NAME = 'friendships' // display on database

export interface IFriendShip {
  senderId: string
  receiveId: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IFriendShip>(
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
      enum: ['PENDING', 'FRIEND', 'BLOCKED', 'REJECTED']
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

schema.index({ senderId: 1, receiveId: 1 }, { unique: true })

const FriendShipModel = model<IFriendShip>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
)

export default FriendShipModel
