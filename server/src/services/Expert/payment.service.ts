import { inject, injectable } from "inversify";
import { IPaymentService } from "../../core/interfaces/services/IPaymentService";
import {Stripe} from 'stripe'
import { TYPES } from "../../di/types";
import { IPlanRespository } from "../../core/interfaces/repositories/IPlansRepository";
import dotenv from 'dotenv'
import { IExpertRepository } from "../../core/interfaces/repositories/IExpertRepository";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepositroy";
import { ObjectId, Types } from "mongoose";
dotenv.config()
@injectable()
export class PaymentService implements IPaymentService{
    private stripe:Stripe
    constructor(
        @inject(TYPES.PlanRepository) private planRepository:IPlanRespository,
        @inject(TYPES.ExpertRepository) private expertRepository:IExpertRepository,
        @inject(TYPES.PaymentRepository) private paymentRepository:IPaymentRepository
    ){
        this.stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)
    }
    async planPurchase(expertId: string, planId: string) {
        try {
            const existingPlan=await this.planRepository.findById(planId)
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

        } catch (error:any) {
            throw new Error(error.message || 'Payment processing failed');
        }
    }
    async paymentVerify(expertId: string, paymentIntentId: string,planId:string): Promise<any> {
        try {
            const paymentDetails= await this.stripe.paymentIntents.retrieve(paymentIntentId)
            console.log(paymentDetails)
            if(paymentDetails.status !== 'succeeded'){
                return {success:false,message:"Payment not successful"}
            }
            const selectedPlan= await this.planRepository.findById(planId)
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
            const updateExpert= await this.expertRepository.findByIdAndUpdate(expertId,{subscription})
            const paymentData={
                expertId: new Types.ObjectId(expertId),
                planId: new Types.ObjectId(planId),
                amount: paymentDetails.amount / 100,
                paymentIntentId: paymentDetails.id,
            }
            const createdPayment= await this.paymentRepository.create(paymentData)
            return {
                success: true,
                message: "Payment verified and subscription activated",
                paymentDetails: createdPayment,
              };

        } catch (error:any) {
            console.error("Payment verification failed:", error);
            return { success: false, message: error.message ||"Internal server error" };
        }
    }
}