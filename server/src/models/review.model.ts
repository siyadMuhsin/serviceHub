import mongoose,{Document} from 'mongoose';



export interface IReview extends Document{
    expertId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    rating:number;
    reviewText:string;
    createdAt:Date
}
const reviewSchema = new mongoose.Schema<IReview>({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for preventing duplicate reviews
// reviewSchema.index({ expertId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema);