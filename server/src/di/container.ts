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
import { IExpertDataController } from '../core/interfaces/controllers/IExpertDataController';
import { ExpertDataController } from '../controllers/Expert/expert.data.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<ITokenController>(TYPES.TokenController).to(TokenController);
container.bind<IUsersController>(TYPES.UsersController).to(UsersController);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);


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
container.bind<IExpertDataController>(TYPES.ExpertDataController).to(ExpertDataController)
export default container;