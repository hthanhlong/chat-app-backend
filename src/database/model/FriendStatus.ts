import { model, Schema } from 'mongoose'

export const DOCUMENT_NAME = 'FriendStatus'
export const COLLECTION_NAME = 'friendstatus' // display on database

export interface IFriendStatus {
  status: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IFriendStatus>(
  {
    status: {
      type: Schema.Types.String,
      unique: true,
      default: 'PENDING',
      value: ['PENDING', 'FRIEND', 'UNFRIEND', 'REJECT']
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const FriendStatusModel = model<IFriendStatus>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
)

export default FriendStatusModel
