import { IPayment } from "../../../models/payment.model";

export interface IPaymentService {
  planPurchase(
    expertId: string,
    planId: string
  ): Promise<{
    success: boolean;
    message: string;
    clientSecret?: string | null;
  }>;
  paymentVerify(
    expertId: string,
    paymentIntentId: string,
    planId: string
  ): Promise<any>;

  getAllEarnings(
    planName: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    data:any
  }>;
}
