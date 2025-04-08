import { BlobOptions } from "buffer";
import { IExpert } from "../../../types/Expert";

export interface IUserExpertService {
  getExpertsByService(
    serviceId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    experts: IExpert[] | null;
  }>;
  getExpertDetails(userId:string,experId:string):Promise<{
    success:boolean,
    message:string,
    expert?:IExpert |null
  }>

}
