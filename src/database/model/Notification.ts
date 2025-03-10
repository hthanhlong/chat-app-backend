import { model, Schema, Types } from 'mongoose'

export const DOCUMENT_NAME = 'Notification'
export const COLLECTION_NAME = 'notifications' // display on database

export interface INotification {
  senderId: Types.ObjectId
  receiverId: Types.ObjectId
  type: string
  content: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<INotification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: Schema.Types.String,
      value: ['FRIEND', 'MESSAGE', 'POST']
    },
    content: {
      type: Schema.Types.String,
      max_length: 1000
    },
    status: {
      type: Schema.Types.String,
      default: 'UNREAD',
      value: ['UNREAD', 'READ']
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const NotificationModel = model<INotification>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
)

export default NotificationModel
