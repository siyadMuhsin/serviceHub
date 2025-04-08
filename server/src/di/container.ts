import { Container } from 'inversify';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/UserRepository';
import { AdminRepository } from '../repositories/Admin/admin.repository';
import { UsersController } from '../controllers/Admin/user.controller';
import { OtpRepository } from '../repositories/OtpRepository';
import { TokenController } from '../controllers/Token.controller';
import { AdminAuthController } from '../controllers/Admin/admin.auth.controller';
import { IAuthService } from '../core/interfaces/services/IAuthService';
import { IUserService } from '../core/interfaces/services/IUserService';
import { UserService } from '../services/Admin/user.service';
import { IUsersController } from '../core/interfaces/controllers/IUsersController';
import { AdminService } from '../services/Admin/admin.service';
import { IAdminService } from '../core/interfaces/services/IAdminService';
import { IAdminRepository } from '../core/interfaces/repositories/IAdminRepository';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IOtpRepository } from '../core/interfaces/repositories/IOtpRepository';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { ITokenController } from '../core/interfaces/controllers/ITokenController';
import { IAdminAuthController } from '../core/interfaces/controllers/IAdminAuthController';
import { AuthMiddlewareService } from '../services/middleware/authMiddleware.service';
import { IAuthMiddleware } from '../core/interfaces/middleware/IAuthMiddleware';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { IServiceController } from '../core/interfaces/controllers/IServiceController';
import { IServiceRepository } from '../core/interfaces/repositories/IServiceRepository';
import { ServiceController } from '../controllers/Admin/services.controller';
import { ServiceRepository } from '../repositories/Admin/services.repository';
import { ServiceService } from '../services/Admin/services.service';
import { IServiceService } from '../core/interfaces/services/IServiceService';
import { TYPES } from './types';
import { ICategoryController } from '../core/interfaces/controllers/ICategoryController';
import { CategoryController } from '../controllers/Admin/category.controller';
import { ICategoryService } from '../core/interfaces/services/ICategoryService';
import { CategoryService } from '../services/Admin/category.service';
import { ICategoryRepository } from '../core/interfaces/repositories/ICategoryRepository';
import { CategoryRepository } from '../repositories/Admin/category.respository';
import { IExpertController } from '../core/interfaces/controllers/IExpertController';
import { ExpertController } from '../controllers/Expert/expert.controller';
import { IExpertService } from '../core/interfaces/services/IExpertService';
import { ExpertService } from '../services/Expert/expert.service';
import { ExpertRepository } from '../repositories/Expert/Expert.respository';
import { IExpertRepository } from '../core/interfaces/repositories/IExpertRepository';
import { ExpertProfileController } from '../controllers/Expert/expert.profile.controller';
import { IProfileController } from '../core/interfaces/controllers/IProfileController';
import { ProfileController } from '../controllers/User/user.controller';
import { IProfileService } from '../core/interfaces/services/IProfileService';
import { ProfileService } from '../services/User/user.service';
import { IPlansController } from '../core/interfaces/controllers/IPlansController';
import { PlansController } from '../controllers/Admin/plans.controller';
import { IPlanService } from '../core/interfaces/services/IPlansService';
import { PlansService } from '../services/Admin/plans.service';
import { IPlanRespository } from '../core/interfaces/repositories/IPlansRepository';
import { PlanRepository } from '../repositories/Admin/plans.repository';
import { IPaymentController } from '../core/interfaces/controllers/IPaymentController';
import { PaymentController } from '../controllers/Expert/payment.controller';
import { IPaymentService } from '../core/interfaces/services/IPaymentService';
import { PaymentService } from '../services/Expert/payment.service';
import { IPaymentRepository } from '../core/interfaces/repositories/IPaymentRepositroy';
import { PaymentRepository } from '../repositories/Expert/payment.respository';
import { IExpertProfileController } from '../core/interfaces/controllers/IExpertProfileController';
import { IExpertProfileService } from '../core/interfaces/services/IExpertProfileService';
import { ExpertProfileService } from '../services/Expert/expertProfile.service';
import { IUserExpertController } from '../core/interfaces/controllers/IUserExpertController';
import { UserExpertController } from '../controllers/User/user.expert.controller';
import { IUserExpertService } from '../core/interfaces/services/IUserExpertService';
import { UserExpertService } from '../services/User/user.expert.service';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService)
// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<ITokenController>(TYPES.TokenController).to(TokenController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);
container.bind<IProfileController>(TYPES.ProfileController).to(ProfileController)
//middleware
container.bind<AuthMiddlewareService>(TYPES.AuthMiddlewareService)
    .toDynamicValue(() => new AuthMiddlewareService(
        container.get<IUserService>(TYPES.UserService),
        process.env.ACCESS_SECRET as string
    ));
container.bind<IAuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<ICategoryController>(TYPES.CategoryController).to(CategoryController)
container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository)
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService)
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);
container.bind<IServiceService>(TYPES.ServiceService).to(ServiceService);
container.bind<IServiceController>(TYPES.ServiceController).to(ServiceController);


container.bind<IExpertController>(TYPES.ExpertController).to(ExpertController)
container.bind<IExpertService>(TYPES.ExpertService).to(ExpertService)
container.bind<IExpertRepository>(TYPES.ExpertRepository).to(ExpertRepository)
container.bind<IExpertProfileController>(TYPES.ExpertProfileController).to(ExpertProfileController)
// subscription management
container.bind<IPlansController>(TYPES.PlansController).to(PlansController)
container.bind<IPlanService>(TYPES.PlansService).to(PlansService)
container.bind<IPlanRespository>(TYPES.PlanRepository).to(PlanRepository)

// payment controler
container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController)
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService)
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository)

container.bind<IExpertProfileService>(TYPES.ExpertProfileService).to(ExpertProfileService)


//user
container.bind<IUserExpertController>(TYPES.UserExpertController).to(UserExpertController)
container.bind<IUserExpertService>(TYPES.UserExpertService).to(UserExpertService)
export default container;