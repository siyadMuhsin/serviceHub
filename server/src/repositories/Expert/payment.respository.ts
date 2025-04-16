import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepositroy";
import { IPayment } from "../../models/payment.model";
import Payment from "../../models/payment.model";
import PlanModel from "../../models/plans.model";
export class PaymentRepository implements IPaymentRepository {
  async create(data: Partial<IPayment>): Promise<IPayment> {
    return await new Payment({ ...data }).save();
  }

  async findAll(filter: { plan?: string }, page: number, limit: number) {
    try {
      const query: any = {};
  
      // Handle plan name filtering
      if (filter.plan) {
        const plan = await PlanModel.findOne({ name: filter.plan }).select('_id');
        if (plan) {
          query['planId'] = plan._id;
        } else {
          return {
            data: [],
            total: 0,
            page,
            limit,
          };
        }
      }
      const payments = await Payment.find(query)
        .populate({
          path: "expertId",
          select: "userId",
          populate: {
            path: "userId",
            select: "name profile_image",
          },
        })
        .populate({ path: "planId", select: "name" })
        .skip((page - 1) * limit)
        .limit(limit);
  
      const total = await Payment.countDocuments(query);
      const totalEarningsAgg = await Payment.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      return {
        data: payments,
        totalEarningsAgg,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(
        "Database fetch error: " +
          (error instanceof Error ? error.message : "Unknown")
      );
    }
  }
}
