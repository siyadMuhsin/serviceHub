import mongoose, { Document, Schema } from "mongoose";


export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  senderModel: 'User' | 'Worker';
  receiver: mongoose.Types.ObjectId;
  receiverModel: 'User' | 'Worker';
  content: string;
  timestamp?: Date;
  read?: boolean;
}
const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Worker']
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Worker']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<IMessage>('Message', messageSchema);
