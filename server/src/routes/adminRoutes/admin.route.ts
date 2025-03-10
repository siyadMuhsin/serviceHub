
import express,{ Express } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
import servicesController from "../../controllers/Admin/services.controller";
import categoryController from "../../controllers/Admin/category.controller";
import userController from "../../controllers/Admin/user.controller";
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
router.put("/category/:id",upload.single('image'), categoryController.updateCategory);
router.patch('/category/:id/status',categoryController.list_and_unlist)
router.delete("/category/:id", categoryController.deleteCategory);

//service routes
router.post("/service", upload.single('image'),servicesController.createService);
router.get("/services", servicesController.getAllServices);
router.patch('/service/:id/status',servicesController.ist_and_unlist)
router.get("/sercvices/:id", servicesController.getServiceById);
router.get("/services/category/:categoryId", servicesController.getServicesByCategory);
router.put("/service/:id",upload.single('image'), servicesController.updateService);


// users routes
router.get('/users',userController.getUsers)
router.patch('/user/:id',userController.block_unblockUser)

export default router