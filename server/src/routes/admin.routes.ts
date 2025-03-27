
import express,{ Express } from "express";
import container from "../di/container";
import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { verifyAdmin } from "../middlewares/adminSecure";
import { IAdminAuthController } from "../core/interfaces/controllers/IAdminAuthController";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";
import { IUsersController } from "../core/interfaces/controllers/IUsersController";
import {TYPES} from '../di/types'
import upload from "../config/multer";
import { IServiceController } from "../core/interfaces/controllers/IServiceController";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
const router= express.Router()


const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController);
const tokenController = container.get<ITokenController>(TYPES.TokenController);

router.post('/login', adminAuthController.login.bind(adminAuthController));
router.post('/logout', adminAuthController.logout.bind(adminAuthController));
router.post('/refresh', tokenController.adminRefreshToken.bind(tokenController));
router.get('/', verifyAdmin, adminAuthController.checkAdmin.bind(adminAuthController));



//category routes
const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
router.post('/category',upload.single('image'),categoryController.createCategory.bind(categoryController))
router.get("/categories", categoryController.getCategoryToManage.bind(categoryController));
router.put("/category/:id",upload.single('image'), categoryController.updateCategory.bind(categoryController));
router.patch('/category/:id/status',categoryController.list_and_unlist.bind(categoryController))


//service routes

const servicesController= container.get<IServiceController>(TYPES.ServiceController)
router.post("/service", upload.single('image'),servicesController.createService.bind(servicesController));
router.get("/services", servicesController.getServicesToMange.bind(servicesController));
router.patch('/service/:id/status',servicesController.ist_and_unlist.bind(servicesController))
router.get("/sercvices/:id", servicesController.getServiceById.bind(servicesController));
router.get("/services/category/:categoryId", servicesController.getServicesByCategory.bind(servicesController));
router.put("/service/:id",upload.single('image'), servicesController.updateService.bind(servicesController));



// User management routes
const usersController = container.get<IUsersController>(TYPES.UsersController);

router.get('/users', usersController.getUsers.bind(usersController));
router.patch('/user/:id', usersController.block_unblockUser.bind(usersController));

//expert management
const expertController= container.get<IExpertController>(TYPES.ExpertController)

router.get('/experts',expertController.getExperts.bind(expertController))
router.patch('/expert/:id',expertController.actionChange.bind(expertController))
router.patch('/expert/block/:id',expertController.blockAndUnlockExpert.bind(expertController))
router.get('/expert/:id',expertController.getExpertData.bind(expertController))
export default router