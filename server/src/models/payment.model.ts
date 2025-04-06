import mongoose, { Types,Document } from "mongoose";

export interface IPayment extends Document{
    expertId:Types.ObjectId,
    planId:Types.ObjectId,
    amount:number,
    paymentIntentId:string,
    createdAt:Date


}
const paymentSchema = new mongoose.Schema<IPayment>({
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plans',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    paymentIntentId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Payment= mongoose.model<IPayment>('Payment',paymentSchema)

  export default Payment