import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Message';
export const COLLECTION_NAME = 'messages';

export default interface Message {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  text: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Message>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: Schema.Types.String,
    },
    file: {
      type: Schema.Types.String,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const UserModel = model<Message>(DOCUMENT_NAME, schema, COLLECTION_NAME);
