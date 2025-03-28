import { Router } from "express";
import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { IAuthMiddleware } from "../core/interfaces/middleware/IAuthMiddleware";
import container from "../di/container";
import { TYPES } from "../di/types";
import { IServiceController } from "../core/interfaces/controllers/IServiceController";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";


const router= Router()
const authMiddleware= container.get<IAuthMiddleware>(TYPES.AuthMiddleware)
const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
const servicesController= container.get<IServiceController>(TYPES.ServiceController)
router.get('/categories',categoryController.categoriesByLimit.bind(categoryController))
router.get('/categories/all',categoryController.getAllCategories.bind(categoryController))
router.get('/services/all',servicesController.getAllServices.bind(servicesController))
router.get('/services/:categoryId',servicesController.getServicesByCategory_limit.bind(servicesController))
const expertController= container.get<IExpertController>(TYPES.ExpertController)
router.get('/switch_expert',authMiddleware.verifyToken.bind(authMiddleware),expertController.switch_expert.bind(expertController))


export default router