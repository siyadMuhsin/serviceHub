import { triggerAsyncId } from "async_hooks";
import { AuthRequest } from "../../types/User";
import { Response } from "express";

class ExpertData{
    async get_expertData(req:AuthRequest,res:Response):Promise<void>{
        try {
            const expertId= req?.expert
            console.log(expertId)
            console.log(res)
            return
        } catch (error) {
            console.log(error)
            res.status(400)
            return
            
        }

    }
}
export default new ExpertData()