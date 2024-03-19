import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'FriendStatus';
export const COLLECTION_NAME = 'friendstatus'; // display on database

export default interface FriendStatus {
  id: string;
  status: string;
}

const schema = new Schema<FriendStatus>(
  {
    id: {
      type: Schema.Types.String,
    },
    status: {
      type: Schema.Types.String,
      default: 'pending',
      value: ['pending', 'accepted', 'rejected', 'blocked'],
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

schema.index({ _id: 1 });

export const FriendStatusModel = model<FriendStatus>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
