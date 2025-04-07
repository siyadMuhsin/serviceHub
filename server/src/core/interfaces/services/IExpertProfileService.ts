import { AuthRequest } from "../../../types/User";

export interface IExpertProfileService{
updateExpertLocation(location:{lat:number,lng:number},expertId:string):Promise<{
    success:boolean,
    message:string
}>
uploadImage(experId:string,file:Express.Multer.File):Promise<{
    success:boolean,
    message:string,
    imageData?:{imageUrl:string,title:string}
}>
deleteImageFromGallery(expertId:string,imageUrl:string):Promise<{
    success:boolean,
    message:string
}>
}