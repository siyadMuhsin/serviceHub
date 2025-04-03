import { Router } from "express";
import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { IAuthMiddleware } from "../core/interfaces/middleware/IAuthMiddleware";
import container from "../di/container";
import { TYPES } from "../di/types";
import { IServiceController } from "../core/interfaces/controllers/IServiceController";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
import { IUsersController } from "../core/interfaces/controllers/IUsersController";
import { IProfileController } from "../core/interfaces/controllers/IProfileController";
import upload from "../config/multer";
const router= Router()

const authMiddleware= container.get<IAuthMiddleware>(TYPES.AuthMiddleware)
const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
const servicesController= container.get<IServiceController>(TYPES.ServiceController)
const profileController= container.get<IProfileController>(TYPES.ProfileController)

router.get('/categories',categoryController.categoriesByLimit.bind(categoryController))
router.get('/categories/all',categoryController.getAllCategories.bind(categoryController))
router.get('/services/all',servicesController.getAllServices.bind(servicesController))
router.get('/services/:categoryId',servicesController.getServicesByCategory_limit.bind(servicesController))


router.patch('/location',authMiddleware.verifyToken.bind(authMiddleware),profileController.add_location.bind(profileController))
const expertController= container.get<IExpertController>(TYPES.ExpertController)
router.get('/switch_expert',authMiddleware.verifyToken.bind(authMiddleware),expertController.switch_expert.bind(expertController))

router.get('/expert',authMiddleware.verifyToken.bind(authMiddleware),profileController.getExistingExpert.bind(profileController))

router.post('/profile/image',upload.single("image"),authMiddleware.verifyToken.bind(authMiddleware),profileController.profileImageUpload.bind(profileController))
router.put('/profile',authMiddleware.verifyToken.bind(authMiddleware),profileController.profileUpdate.bind(profileController))
export default router