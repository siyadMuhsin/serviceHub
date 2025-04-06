import { IPayment } from "../../../models/payment.model";

export interface IPaymentRepository{
    create(data:Partial<IPayment>):Promise<IPayment>
}