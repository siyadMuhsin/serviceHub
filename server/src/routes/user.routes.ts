import { Router } from "express";
import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { IAuthMiddleware } from "../core/interfaces/middleware/IAuthMiddleware";
import container from "../di/container";
import { TYPES } from "../di/types";
import { IServiceController } from "../core/interfaces/controllers/IServiceController";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
import { IProfileController } from "../core/interfaces/controllers/IProfileController";
import upload from "../config/multer";
import { IUserExpertController } from "../core/interfaces/controllers/IUserExpertController";
import { IBookingController } from "../core/interfaces/controllers/IBookingController";
import { ISlotController } from "../core/interfaces/controllers/ISlotController";
import { IReviewController } from "../core/interfaces/controllers/IReviewController";

const router = Router();

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const verifyUser = authMiddleware.verifyToken.bind(authMiddleware);

const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
const servicesController = container.get<IServiceController>(TYPES.ServiceController);
const profileController = container.get<IProfileController>(TYPES.ProfileController);
const userExpertController = container.get<IUserExpertController>(TYPES.UserExpertController);
const expertController = container.get<IExpertController>(TYPES.ExpertController);
const slotController= container.get<ISlotController>(TYPES.SlotController)
const bookingController= container.get<IBookingController>(TYPES.BookingController)
const reviewController= container.get<IReviewController>(TYPES.ReviewController)

// ✅ Protected Category Routes
router.get('/categories', verifyUser, categoryController.categoriesByLimit.bind(categoryController));
router.get('/categories/all', verifyUser, categoryController.getAllCategories.bind(categoryController));

// ✅ Protected Service Routes
router.get('/services/all', verifyUser, servicesController.getAllServices.bind(servicesController));
router.get('/services/:categoryId', verifyUser, servicesController.getServicesByCategory_limit.bind(servicesController));

// ✅ Protected Profile Routes
router.patch('/location', verifyUser, profileController.add_location.bind(profileController));
router.post('/profile/image', upload.single("image"), verifyUser, profileController.profileImageUpload.bind(profileController));
router.put('/profile', verifyUser, profileController.profileUpdate.bind(profileController));
router.patch('/profile/changePassword', verifyUser, profileController.changePassword.bind(profileController));

// ✅ Expert Routes
router.get('/switch_expert', verifyUser, expertController.switch_expert.bind(expertController));
router.get('/expert', verifyUser, profileController.getExistingExpert.bind(profileController));

// ✅ User-Expert Routes
router.get('/user/expert/service/:serviceId', verifyUser, userExpertController.getExpertSpecificService.bind(userExpertController));
router.get('/user/expert/:expertId', verifyUser, userExpertController.getExpertDetails.bind(userExpertController));
router.get('/slots/:expertId',verifyUser,slotController.getSlotToUser.bind(slotController))
router.post('/book',verifyUser,upload.array('images' ,5),bookingController.bookingCreate.bind(bookingController))

router.get('/bookings',verifyUser,bookingController.getUserBooking.bind(bookingController))
router.patch('/bookings/:bookingId',verifyUser,bookingController.userCancelBooking.bind(bookingController))

router.post('/review',verifyUser,reviewController.reviewSubmit.bind(reviewController))
router.get('/reviews/:expertId',verifyUser,reviewController.getReviewsForUser.bind(reviewController))

// save service
router.patch('/service-save/:serviceId',verifyUser,profileController.saveService.bind(profileController))
router.patch('/service-unsave/:serviceId',verifyUser,profileController.unsaveService.bind(profileController))
router.get('/saved-service',verifyUser,profileController.getSavedServices.bind(profileController))
export default router;
