import { Request,Response } from "express";
import userService from "../../services/Admin/user.service";
import { HttpStatus } from "../../types/httpStatus";
class UsersController {
    async getUsers(req: Request, res: Response):Promise<void> {
        try {
            const response = await userService.getUsers();
            res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
            return
        } catch (error) {
             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "An error occurred while fetching users." });
             return
        }
    }
    async block_unblockUser(req:Request,res:Response):Promise<void>{
        try {
        const { id } = req.params;
        const { block } = req.body;
        if (typeof block !== "boolean") {
            res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid status value" });
            return
        }

        const response= await userService.blockUnblockUser(id,block)
        res.status(response.success?HttpStatus.OK:HttpStatus.BAD_REQUEST).json(response)
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
            return
        }
    }

}
export default new UsersController()