import { IUser } from "../../../models/user.model";
import { IExpert } from "../../../types/Expert";

export interface IProfileService{
    addLocation(userId:string,lat:number,lng:number):Promise< { 
        success: boolean;
         message: string 
    }>
    getExpertData (id:string):Promise<{
        success:boolean,
        message:string,
        expert?:IExpert | undefined
    }>
    profileImageUpload(userId:string,file:Express.Multer.File):Promise<{
        success:boolean,
        message:string,
        profileImageUrl?:string
    }>
    profileUpdate(userId:string,data: Partial<Omit<IUser, "location">> & { location?: { lat: number; lng: number }}):Promise<{
        success:boolean,
        message:string,
    }>
    changePassword(userId:string,oldPassword:string,newPassword:string):Promise<{
        success:boolean,
        message:string
    }>
    saveService(userId:string,serviceId:string):Promise<{
        success:boolean,
        message:string,
    }>
    unsaveService(userId:string,serviceId:string):Promise<{
        success:boolean,
        message:string,
    }>
    getSavedServices(userId:string):Promise<{
        success:boolean,
        message:string,
        services?:any[]
    }>
}