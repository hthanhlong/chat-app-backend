import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Message';
export const COLLECTION_NAME = 'messages'; // display on database

export default interface Message {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  file?: string;
}

const schema = new Schema<Message>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: Schema.Types.String,
    },
    file: {
      type: Schema.Types.String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ _id: 1 });

export const MessageModel = model<Message>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
