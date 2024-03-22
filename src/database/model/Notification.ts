import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Notification';
export const COLLECTION_NAME = 'notifications'; // display on database

export default interface Notification {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  type: string;
  content: string;
  status: string;
}

const schema = new Schema<Notification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: Schema.Types.String,
      value: ['FRIEND', 'MESSAGE', 'POST'],
    },
    content: {
      type: Schema.Types.String,
      max_length: 1000,
    },
    status: {
      type: Schema.Types.String,
      default: 'UNREAD',
      value: ['UNREAD', 'READ'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ _id: 1 });

export const NotificationModel = model<Notification>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
