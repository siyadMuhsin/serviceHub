import { PlanRepository } from "../repositories/Admin/plans.repository";

export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    OtpRepository: Symbol.for('OtpRepository'),
    AdminRepository:Symbol.for('AdminRepository'),
    CategoryRepository:Symbol.for('CategoryRepository'),
    ServiceRepository:Symbol.for('ServiceRepository'),
    ExpertRepository:Symbol.for('ExpertRepository'),
    // Services
    AuthService: Symbol.for('AuthService'),
    AdminService:Symbol.for('AdminService'),
    UserService:Symbol.for('UserService'),
    CategoryService:Symbol.for('CategoryService'),
    ServiceService:Symbol.for('ServiceService'),
    ExpertService:Symbol.for('ExpertService'),
    
    // Controllers
    AuthController: Symbol.for('AuthController'),
    TokenController: Symbol.for('TokenController'),
    AdminAuthController:Symbol.for('AdminAuthController'),
    UsersController:Symbol.for('UsersController'),
    CategoryController: Symbol.for('CategoryController'),
    ServiceController:Symbol.for('ServiceController'),
   
    
    ExpertDataController: Symbol.for('ExpertDataController'),
    ExpertController:Symbol.for('ExpertController'),
    //middleware
    AuthMiddlewareService:Symbol.for('AuthMiddlewareService'),
    AuthMiddleware:Symbol.for('AuthMiddleware'),


    //profle types
    ProfileService:Symbol.for('ProfileService'),
    ProfileController:Symbol.for('ProfileController'),

    //subscrioption
    PlansController:Symbol.for('PlansController'),
    PlansService:Symbol.for('PlansService'),
    PlanRepository:Symbol.for('PlanRepository')
    
  };