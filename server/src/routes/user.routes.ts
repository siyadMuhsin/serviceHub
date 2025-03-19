import { Router } from "express";
import adminAuthController from "../controllers/Admin/admin.auth.controller";
import categoryController from "../controllers/Admin/category.controller";
import servicesController from "../controllers/Admin/services.controller";
import verifyToken from "../middlewares/authMiddleware";
import expertController from "../controllers/Expert/expert.controller";
import userController from "../controllers/Admin/user.controller";
const router= Router()


router.get('/categories',categoryController.categoriesByLimit)
router.get('/services/:categoryId',servicesController.getServicesByCategory_limit)
router.get('/switch_expert',verifyToken,expertController.switch_expert)


export default router