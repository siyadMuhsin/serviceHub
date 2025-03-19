import { Request,Response } from "express";
import userService from "../../services/Admin/user.service";
class UsersController {
    async getUsers(req: Request, res: Response):Promise<void> {
        try {
            const response = await userService.getUsers();
            res.status(response.success ? 200 : 400).json(response);
            return
        } catch (error) {
             res.status(500).json({ success: false, message: "An error occurred while fetching users." });
             return
        }
    }
    async block_unblockUser(req:Request,res:Response):Promise<void>{
        try {
        const { id } = req.params;
        const { block } = req.body;
console.log(id)
        if (typeof block !== "boolean") {
            res.status(400).json({ success: false, message: "Invalid status value" });
            return
        }

        const response= await userService.blockUnblockUser(id,block)
        res.status(response.success?200:400).json(response)
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
            return
        }
    }

}
export default new UsersController()