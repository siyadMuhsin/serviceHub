import { Router } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
import categoryController from "../../controllers/Admin/category.controller";
import servicesController from "../../controllers/Admin/services.controller";
import AuthController from "../../controllers/AuthController";
import verifyToken from "../../middlewares/authMiddleware";
const router= Router()
router.get('/categories',categoryController.categoriesByLimit)
router.get('/services/:categoryId',servicesController.getServicesByCategory_limit)

router.post('/switch-role/',verifyToken,AuthController.switchRole)


export default router