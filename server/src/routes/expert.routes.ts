import express,{NextFunction, Request,Response} from "express";
import multer from "multer";
import container from "../di/container";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
import { TYPES } from "../di/types";
import { IExpertProfileController } from "../core/interfaces/controllers/IExpertProfileController";
import { IAuthMiddleware } from "../core/interfaces/middleware/IAuthMiddleware";
import { IPlansController } from "../core/interfaces/controllers/IPlansController";
import { IPaymentController } from "../core/interfaces/controllers/IPaymentController";
import { verify } from "crypto";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";
import { ISlotController } from "../core/interfaces/controllers/ISlotController";
import { IBookingController } from "../core/interfaces/controllers/IBookingController";
import { IReviewController } from "../core/interfaces/controllers/IReviewController";
import { IMessageController } from "../core/interfaces/controllers/IMessageController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const expertController = container.get<IExpertController>(TYPES.ExpertController)
const expertProfileController= container.get<IExpertProfileController>(TYPES.ExpertProfileController)
const plansController= container.get<IPlansController>(TYPES.PlansController)
const tokenController = container.get<ITokenController>(TYPES.TokenController);
const paymentController=container.get<IPaymentController>(TYPES.PaymentController)
const slotController= container.get<ISlotController>(TYPES.SlotController)
const authMiddleware= container.get<IAuthMiddleware>(TYPES.AuthMiddleware)
const bookingController=container.get<IBookingController>(TYPES.BookingController)
const reviewController= container.get<IReviewController>(TYPES.ReviewController)
const messageController=container.get<IMessageController>(TYPES.MessageController)

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
router.post('/auth/refresh',tokenController.refreshToken.bind(tokenController))

// slot management
router.post('/slot',test,verifyExpert,slotController.addExpertSlot.bind(slotController))
router.get('/slots',verifyExpert,slotController.getSlotsToExpert.bind(slotController))
router.delete('/slot/:slotId',verifyExpert,slotController.deleteSlot.bind(slotController))
//booking management
router.get('/booking',verifyExpert,bookingController.getBookingToExpert.bind(bookingController))
router.patch('/booking/:bookingId',verifyExpert,bookingController.bookingStatusChange.bind(bookingController))

// review management
router.get('/reviews',verifyExpert,reviewController.getReviewsForExpert.bind(reviewController))

// messages
router.get('/chat/users',verifyExpert,messageController.getChatUsers.bind(messageController))
router.get('/chat/:receiverId',verifyExpert,messageController.getConversation.bind(messageController))

export default router;

function test(req:Request,res:Response,next:NextFunction){

    console.log('working')
    next()

}