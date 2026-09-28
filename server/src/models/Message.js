import mongoose from 'mongoose';
import { DEFAULT_ROOM, MESSAGE_MAX_LENGTH } from '../config/constants.js';

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, default: DEFAULT_ROOM },
    sender: { type: ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, minlength: 1, maxlength: MESSAGE_MAX_LENGTH },
    clientId: { type: String, required: true },
    deliveredTo: [{ type: ObjectId, ref: 'User' }],
    readBy: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true, versionKey: false },
);

messageSchema.index({ room: 1, createdAt: -1, _id: -1 });
messageSchema.index({ sender: 1, clientId: 1 }, { unique: true });

export const Message = mongoose.model('Message', messageSchema);
