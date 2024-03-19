import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'FriendShip';
export const COLLECTION_NAME = 'friendships'; // display on database

export default interface FriendShip {
  userId_1: string;
  userId_2: string;
  status: string;
}

const schema = new Schema<FriendShip>(
  {
    userId_1: {
      type: Schema.Types.String,
      ref: 'User',
    },
    userId_2: {
      type: Schema.Types.String,
      ref: 'User',
    },
    status: {
      type: Schema.Types.String,
      ref: 'FriendStatus',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ _id: 1, userId_1: 1 });
schema.index({ userId_1: 1, userId_2: 1 }, { unique: true });

export const FriendShipModel = model<FriendShip>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
