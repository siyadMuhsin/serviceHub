import { IReview } from "../../../models/review.model";

export interface IReviewService{
     submitReview(rating:number,reviewText:string,expertId:string,userId:string):Promise<{
        success:boolean,
        message:string,
        review?:IReview
    }> 
    getReviewsToUser(expertId:string,page:number,limit:number):Promise<{
        success:boolean,
        message:string,
        review?:IReview[],
        currentPage?: number;
        totalPages?: number;
        avgRating?:number
    }>
}