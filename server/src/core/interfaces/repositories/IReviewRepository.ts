import { Types } from "mongoose";
import { IReview } from "../../../models/review.model";

export interface IReviewRepository {
  create(data: Partial<IReview>): Promise<IReview>;
  findOne(data: Partial<IReview>): Promise<IReview | null>;
  findByExpertId(
    expertId: string,
    page: number,
    limit: number
  ): Promise<{
    reviews: IReview[];
    total: number;
    avgRating: number;
    totalRating: number;
  }>;
   getAverageRatingsByExpertIds(expertIds: Types.ObjectId[]): Promise<{
      expertId: Types.ObjectId;
      average: number;
      count: number;
    }[]>
}
