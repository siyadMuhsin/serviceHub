import { inject, injectable } from "inversify";
import { IReviewRepository } from "../core/interfaces/repositories/IReviewRepository";
import { BaseRepository } from "./BaseRepository";
import reviewModel, { IReview } from "../models/review.model";
import mongoose from "mongoose";
export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository{
    constructor(){
        super(reviewModel)
    }
   async findByExpertId(expertId: string,page:number,limit:number): Promise<{reviews:IReview[],total:number,avgRating:number,totalRating:number}> {
    const skip = (page-1)*limit
    const [reviews, total, ratingStats] = await Promise.all([
      reviewModel.find({ expertId })
        .populate('userId', 'name profile_image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    
      this.count({ expertId }),
    
      reviewModel.aggregate([
        { $match: { expertId: new mongoose.Types.ObjectId(expertId) } },
        {
          $group: {
            _id: null,
            totalRating: { $sum: "$rating" },
            avgRating: { $avg: "$rating" }
          }
        }
      ])
    ]);
    const ratingInfo = ratingStats[0] || { totalRating: 0, avgRating: 0 };
      return {
         reviews, 
        total , 
         avgRating: ratingInfo.avgRating,
        totalRating: ratingInfo.totalRating
      }
   }
}