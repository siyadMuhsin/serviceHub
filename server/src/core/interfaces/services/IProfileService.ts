export interface IProfileService{
    addLocation(userId:string,lat:number,lng:number):Promise< { 
        success: boolean;
         message: string 
    }>
}