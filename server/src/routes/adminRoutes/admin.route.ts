
import express,{ Express } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
import servicesController from "../../controllers/Admin/services.controller";
import categoryController from "../../controllers/Admin/category.controller";
import { verifyAdmin } from "../../middlewares/adminSecure";
import TokenController from "../../controllers/Token.controller";
import upload from "../../config/multer";
const router= express.Router()


router.post('/login',adminAuthController.login)
router.post('/logout',adminAuthController.logout)

router.post('/refresh',TokenController.adminRefreshToken)
router.get('/',verifyAdmin,adminAuthController.checkAdmin)



//category routes
router.post('/category',upload.single('image'),categoryController.createCategory)
router.get("/categories", categoryController.getAllCategories);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

//service routes
router.post("/service", servicesController.createService);
router.get("/services", servicesController.getAllServices);
router.get("/sercvices/:id", servicesController.getServiceById);
router.get("/services/category/:categoryId", servicesController.getServicesByCategory);
router.put("/service/:id", servicesController.updateService);
router.delete("/service/:id", servicesController.deleteService);

export default router