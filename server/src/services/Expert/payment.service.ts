import { inject, injectable } from "inversify";
import { IPaymentService } from "../../core/interfaces/services/IPaymentService";
import {Stripe} from 'stripe'
import { TYPES } from "../../di/types";
import { IPlanRespository } from "../../core/interfaces/repositories/IPlansRepository";
import dotenv from 'dotenv'
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepositroy";
import { ObjectId, Types } from "mongoose";
import { IPayment } from "../../models/payment.model";
dotenv.config()
@injectable()
export class PaymentService implements IPaymentService{
    private stripe:Stripe
    constructor(
        @inject(TYPES.PlanRepository) private _planRepository:IPlanRespository,
        @inject(TYPES.ExpertRepository) private _expertRepository:IExpertRepository,
        @inject(TYPES.PaymentRepository) private _paymentRepository:IPaymentRepository
    ){
        this.stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)
    }
    async planPurchase(expertId: string, planId: string) {
        try {
            const existingPlan=await this._planRepository.findById(planId)
            if(!existingPlan ){
                return {success:false,message:"No available Plan"}
            }
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: existingPlan.price * 100, // Convert to paise
                currency: 'inr',
                metadata: { expertId, planId },
                description: `Subscription for ${existingPlan.name}`
            });
            return {
                success: true,
                message: 'Payment intent created',
                clientSecret: paymentIntent.client_secret
            };

        } catch (error) {
            const err= error as Error
            throw new Error(err.message || 'Payment processing failed');
        }
    }
    async paymentVerify(expertId: string, paymentIntentId: string,planId:string): Promise<any> {
        try {
            const paymentDetails= await this.stripe.paymentIntents.retrieve(paymentIntentId)
            console.log(paymentDetails)
            if(paymentDetails.status !== 'succeeded'){
                return {success:false,message:"Payment not successful"}
            }
            const selectedPlan= await this._planRepository.findById(planId)
            if(!selectedPlan){
                return {success:false,message:"The Plan is not fount"}
            }

            const startDate=new Date()
            const endDate= new Date()
            endDate.setDate(startDate.getDate()+selectedPlan.durationMonths*30)
            const subscription={
                plan:planId,
                startDate,
                endDate,
                isActive:true
            }
            const updateExpert= await this._expertRepository.findByIdAndUpdate(expertId,{subscription})
            const paymentData={
                expertId: new Types.ObjectId(expertId),
                planId: new Types.ObjectId(planId),
                amount: paymentDetails.amount / 100,
                paymentIntentId: paymentDetails.id,
            }
            const createdPayment= await this._paymentRepository.create(paymentData)
            return {
                success: true,
                message: "Payment verified and subscription activated",
                paymentDetails: createdPayment,
              };

        } catch (error) {
            const err= error as Error
            console.error("Payment verification failed:", error);
            return { success: false, message: err.message ||"Internal server error" };
        }
    }

    async getAllEarnings(plan: string, page: number, limit: number) {
        try {
          const filter = plan ? { plan } : {};
          const { data, total,totalEarningsAgg } = await this._paymentRepository.findAll(filter, page, limit);
          const totalPages = Math.ceil(total / limit);
      const plans= await this._planRepository.findAll()
          return {
            success: true,
            message: 'Earnings fetched successfully',
            data: {
              earnings: data,
              totalEarnings:totalEarningsAgg[0].total ,
              plans,
              pagination: {
                total,
                page,
                limit,
                totalPages
              }
            }
          };
        } catch (error) {
            const err= error as Error
          console.error('Service error:', err);
        throw new Error(err.message)
        }
      }
}