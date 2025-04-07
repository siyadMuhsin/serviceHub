import express,{Request,Response} from "express";
import multer from "multer";
import container from "../di/container";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
import { TYPES } from "../di/types";
import { IExpertProfileController } from "../core/interfaces/controllers/IExpertProfileController";
import { IAuthMiddleware } from "../core/interfaces/middleware/IAuthMiddleware";
import { IPlansController } from "../core/interfaces/controllers/IPlansController";
import { IPaymentController } from "../core/interfaces/controllers/IPaymentController";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const expertController = container.get<IExpertController>(TYPES.ExpertController)
const expertProfileController= container.get<IExpertProfileController>(TYPES.ExpertProfileController)
const plansController= container.get<IPlansController>(TYPES.PlansController)
const paymentController=container.get<IPaymentController>(TYPES.PaymentController)
const authMiddleware= container.get<IAuthMiddleware>(TYPES.AuthMiddleware)

router.post("/create", upload.single("certificate"),authMiddleware.verifyToken.bind(authMiddleware),expertController.createExpert.bind(expertController));
router.get("/fetch-data",authMiddleware.verifyExpert.bind(authMiddleware),expertProfileController.get_expertData.bind(expertProfileController))
router.get("/switch_user",authMiddleware.verifyExpert.bind(authMiddleware),expertController.switch_user.bind(expertController))

router.get('/plans',plansController.getAvailablePlans.bind(plansController))

const verifyExpert=authMiddleware.verifyExpert.bind(authMiddleware)
// plan purchase
router.post('/plan/purchase/:planId',authMiddleware.verifyExpert.bind(authMiddleware),paymentController.planPurchase.bind(paymentController))
router.post('/payment/verify',verifyExpert,paymentController.verifyPayment.bind(paymentController))
router.post('/profile/location',verifyExpert,expertProfileController.updateLocation.bind(expertProfileController))
    
router.post('/profile/image',verifyExpert,upload.single('image'),expertProfileController.imagesUpload.bind(expertProfileController))
router.delete('/profile/image',verifyExpert,expertProfileController.deleteImage.bind(expertProfileController))
export default router;

function test(req:Request,res:Response){
    console.log(req.file)
    console.log('working')

}