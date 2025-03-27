import express from "express";
import multer from "multer";
import container from "../di/container";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
import { TYPES } from "../di/types";
import { IExpertDataController } from "../core/interfaces/controllers/IExpertDataController";
import { IAuthMiddleware } from "../core/interfaces/middleware/IAuthMiddleware";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const expertController = container.get<IExpertController>(TYPES.ExpertController)
const expertDataController= container.get<IExpertDataController>(TYPES.ExpertDataController)
const authMiddleware= container.get<IAuthMiddleware>(TYPES.AuthMiddleware)
router.post("/create", upload.single("certificate"),authMiddleware.verifyToken.bind(authMiddleware),expertController.createExpert.bind(expertController));
router.get("/fetch-data",authMiddleware.verifyExpert.bind(authMiddleware),expertDataController.get_expertData.bind(expertDataController))
router.get("/switch_user",authMiddleware.verifyExpert.bind(authMiddleware),expertController.switch_user.bind(expertController))


export default router;
// function test(req,res){
//     console.log(req.file)
//     console.log('working')

// }