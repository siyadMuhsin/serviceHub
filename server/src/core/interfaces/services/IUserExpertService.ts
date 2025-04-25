import { BlobOptions } from "buffer";
import { IExpert } from "../../../types/Expert";

export interface ExpertListing {
  _id: string;
  name: string;
  profile: string;
  service: string;
  experience: number;
  distanceInKm: number;
  averageRating: number;
  ratingCount: number;
}
export interface IUserExpertService {
  getExpertsByService(
    serviceId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    experts: ExpertListing[] | null;
  }>;
  getExpertDetails(userId:string,experId:string):Promise<{
    success:boolean,
    message:string,
    expert?:IExpert |null
  }>

}
