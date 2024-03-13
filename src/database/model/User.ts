import { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  username: string;
  profilePicUrl?: string;
  email: string;
  password: string;
  verified: boolean;
  isActive: boolean;
  salt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>(
  {
    username: {
      type: Schema.Types.String,
      trim: true,
      max_length: 200,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
      select: false,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      sparse: true, // allows null
      trim: true,
      max_length: 200,
    },
    password: {
      type: Schema.Types.String,
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

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
