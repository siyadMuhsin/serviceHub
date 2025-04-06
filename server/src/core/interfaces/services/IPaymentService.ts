export interface IPaymentService{
    planPurchase(expertId:string,planId:string):Promise<{
        success:boolean,
        message:string,
        clientSecret?:string |null
    }>
    paymentVerify(expertId:string,paymentIntentId :string,planId:string):Promise<any>
}