import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepositroy";
import { IPayment } from "../../models/payment.model";
import Payment from "../../models/payment.model";
export class PaymentRepository implements IPaymentRepository{
    async create(data: Partial<IPayment>): Promise<IPayment> {
        return await new Payment({ ...data }).save();
    }
}