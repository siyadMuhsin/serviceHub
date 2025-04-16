import { IPayment } from "../../../models/payment.model";

export interface IPaymentRepository {
  create(data: Partial<IPayment>): Promise<IPayment>;
  findAll(filter: { plan?: string },page: number,limit: number
  ): Promise<{ data: IPayment[]; total: number; page: number; limit: number ;totalEarningsAgg?:any}>;
}
