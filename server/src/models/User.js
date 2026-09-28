import mongoose from 'mongoose';
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: USERNAME_MIN_LENGTH,
      maxlength: USERNAME_MAX_LENGTH,
    },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model('User', userSchema);
