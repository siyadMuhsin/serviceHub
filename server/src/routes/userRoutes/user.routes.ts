import { Router } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
import categoryController from "../../controllers/Admin/category.controller";
import servicesController from "../../controllers/Admin/services.controller";
const router= Router()
router.get('/categories',categoryController.categoriesByLimit)
router.get('/services/:categoryId',servicesController.getServicesByCategory_limit)


export default router