import { get } from 'lodash';
import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  username: string;
  profilePicUrl?: string;
  email: string;
  password: string;
  nickname?: string;
  caption?: string;
  verified: boolean;
  isActive: boolean;
  salt: string;
}

const schema = new Schema<User>(
  {
    username: {
      type: Schema.Types.String,
      trim: true,
      lowercase: true,
      max_length: 64,
      unique: true,
    },
    nickname: {
      type: Schema.Types.String,
      trim: true,
      max_length: 64,
      default: get(this, 'username') || 'Nickname',
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      lowercase: true,
      trim: true,
      max_length: 100,
    },
    password: {
      type: Schema.Types.String,
    },
    caption: {
      type: Schema.Types.String,
      trim: true,
      max_length: 1000,
      default: 'This is my caption.',
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
    },
    salt: {
      type: Schema.Types.String,
      default: '',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

schema.index({ _id: 1, email: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
