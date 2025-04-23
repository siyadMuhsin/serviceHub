import { inject, injectable } from "inversify";
import { IReviewService } from "../core/interfaces/services/IReviewService";
import { TYPES } from "../di/types";
import { IReviewRepository } from "../core/interfaces/repositories/IReviewRepository";
import { IReview } from "../models/review.model";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IExpertRepository } from "../core/interfaces/repositories/IExpertRepository";
import mongoose, { mongo } from "mongoose";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.ReviewRepository) private reviewRepository: IReviewRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ExpertRepository) private expertRepository: IExpertRepository
  ) {}
  async submitReview(
    rating: number,
    reviewText: string,
    expertId: string,
    userId: string
  ): Promise<{ success: boolean; message: string; review?: IReview }> {
    try {
      const expert = await this.expertRepository.findById(expertId);
      if (!expert) {
        return { success: false, message: "Expert not found" };
      }
      const expertObjectId = new mongoose.Types.ObjectId(expertId);
      const userObjectid = new mongoose.Types.ObjectId(userId);
      const existingReview = await this.reviewRepository.findOne({expertId: expertObjectId,userId: userObjectid,});
      if (existingReview) {
        return {
          success: false,
          message: "You have already reviewed this expert",
        };
      }
      const newReview = await this.reviewRepository.create({
        rating,
        reviewText,
        expertId:expertObjectId,
        userId:userObjectid,
        createdAt: new Date()
      });
      return { success: true, message: "Review submitted successfully", review: newReview };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getReviewsToUser(expertId: string, page: number, limit: number): Promise<{
    success: boolean;
    message: string;
    review?: IReview[];
    currentPage?: number;
    totalPages?: number;
    avgRating?:number;
    total?:number

  }> {
    try {
      const expert = await this.expertRepository.findById(expertId);
      if (!expert) {
        return { success: false, message: "Expert not found" };
      } 
      const { reviews, total ,avgRating,totalRating} = await this.reviewRepository.findByExpertId(expertId, page, limit);
      const totalPages = Math.ceil(total / limit);
      return {
        success: true,
        message: "Reviews fetched successfully",
        review: reviews,
        currentPage: page,
        totalPages,
        avgRating,
        total
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
