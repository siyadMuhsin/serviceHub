import express from "express";
import container from "../di/container";
import { verifyAdmin } from "../middlewares/adminSecure";
import upload from "../config/multer";
import { TYPES } from '../di/types';

import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { IAdminAuthController } from "../core/interfaces/controllers/IAdminAuthController";
import { ITokenController } from "../core/interfaces/controllers/ITokenController";
import { IUsersController } from "../core/interfaces/controllers/IUsersController";
import { IServiceController } from "../core/interfaces/controllers/IServiceController";
import { IExpertController } from "../core/interfaces/controllers/IExpertController";
import { IPlansController } from "../core/interfaces/controllers/IPlansController";
import { IPaymentController } from "../core/interfaces/controllers/IPaymentController";
import { IDashboardController } from "../core/interfaces/controllers/IDashboardController";

const router = express.Router();

// Auth & Token
const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController);
const tokenController = container.get<ITokenController>(TYPES.TokenController);

router.post('/login',adminAuthController.login.bind(adminAuthController));
router.post('/logout', verifyAdmin, adminAuthController.logout.bind(adminAuthController));
router.post('/refresh', tokenController.refreshToken.bind(tokenController));
router.get('/', verifyAdmin, adminAuthController.checkAdmin.bind(adminAuthController));

// Category routes
const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
router.post('/category', upload.single('image'), verifyAdmin, categoryController.createCategory.bind(categoryController));
router.get('/categories', verifyAdmin, categoryController.getCategoryToManage.bind(categoryController));
router.put('/category/:id', upload.single('image'), verifyAdmin, categoryController.updateCategory.bind(categoryController));
router.patch('/category/:id/status', verifyAdmin, categoryController.list_and_unlist.bind(categoryController));

// Service routes
const servicesController = container.get<IServiceController>(TYPES.ServiceController);
router.post('/service', upload.single('image'), verifyAdmin, servicesController.createService.bind(servicesController));
router.get('/services', verifyAdmin, servicesController.getServicesToMange.bind(servicesController));
router.patch('/service/:id/status', verifyAdmin, servicesController.list_and_unlist.bind(servicesController));
router.get('/services/:id', verifyAdmin, servicesController.getServiceById.bind(servicesController));
router.get('/services/category/:categoryId', verifyAdmin, servicesController.getServicesByCategory.bind(servicesController));
router.put('/service/:id', upload.single('image'), verifyAdmin, servicesController.updateService.bind(servicesController));

// User management routes
const usersController = container.get<IUsersController>(TYPES.UsersController);
router.get('/users', verifyAdmin, usersController.getUsers.bind(usersController));
router.patch('/user/:id', verifyAdmin, usersController.block_unblockUser.bind(usersController));

// Expert management
const expertController = container.get<IExpertController>(TYPES.ExpertController);
router.get('/experts', verifyAdmin, expertController.getExperts.bind(expertController));
router.patch('/expert/:id', verifyAdmin, expertController.actionChange.bind(expertController));
router.patch('/expert/block/:id', verifyAdmin, expertController.blockAndUnlockExpert.bind(expertController));
router.get('/expert/:id', verifyAdmin, expertController.getExpertData.bind(expertController));

// Subscription plans
const plansController = container.get<IPlansController>(TYPES.PlansController);
router.post('/plan', verifyAdmin, plansController.createPlan.bind(plansController));
router.patch('/plan/:planId', verifyAdmin, plansController.listAndUnlist.bind(plansController));
router.put('/plan/:planId', verifyAdmin, plansController.updatePlan.bind(plansController));
router.get('/plans', verifyAdmin, plansController.getAllPlans.bind(plansController));

// earnings
const paymentController= container.get<IPaymentController>(TYPES.PaymentController)
router.get('/earnings',verifyAdmin,paymentController.getAllEarnings.bind(paymentController))

// dashboard
const dashboardCotroller= container.get<IDashboardController>(TYPES.DashboardController)
router.get('/users/latest',verifyAdmin,usersController.getLatestUsers.bind(usersController))
router.get('/experts/latest',verifyAdmin,expertController.getLatestExperts.bind(expertController))
router.get('/dashboard/stats',verifyAdmin,dashboardCotroller.getDashboardStats.bind(dashboardCotroller))
export default router;
