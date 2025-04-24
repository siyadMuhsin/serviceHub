import { BookingController } from "../controllers/booking.controller";
import { SlotController } from "../controllers/Expert/slot.controller";
import { MessageController } from "../controllers/message.controller";
import { ReviewController } from "../controllers/review.controller";
import { PlanRepository } from "../repositories/Admin/plans.repository";
import { SlotRepository } from "../repositories/Expert/slot.repository";
import { MessageRepository } from "../repositories/MessageRepository";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { SlotServices } from "../services/Expert/slot.service";
import { MessageService } from "../services/message.service";
import { ReviewService } from "../services/review.service";

export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  ServiceRepository: Symbol.for("ServiceRepository"),
  ExpertRepository: Symbol.for("ExpertRepository"),
  // Services
  AuthService: Symbol.for("AuthService"),
  AdminService: Symbol.for("AdminService"),
  UserService: Symbol.for("UserService"),
  CategoryService: Symbol.for("CategoryService"),
  ServiceService: Symbol.for("ServiceService"),
  ExpertService: Symbol.for("ExpertService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  TokenController: Symbol.for("TokenController"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  UsersController: Symbol.for("UsersController"),
  CategoryController: Symbol.for("CategoryController"),
  ServiceController: Symbol.for("ServiceController"),

  ExpertProfileController: Symbol.for("ExpertProfileController"),
  ExpertController: Symbol.for("ExpertController"),
  //middleware
  AuthMiddlewareService: Symbol.for("AuthMiddlewareService"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  //profle types
  ProfileService: Symbol.for("ProfileService"),
  ProfileController: Symbol.for("ProfileController"),

  //subscrioption
  PlansController: Symbol.for("PlansController"),
  PlansService: Symbol.for("PlansService"),
  PlanRepository: Symbol.for("PlanRepository"),

  //payment
  PaymentController: Symbol.for("PaymentController"),
  PaymentRepository: Symbol.for("PaymentRepository"),
  PaymentService: Symbol.for("PaymentService"),

  //expert
  ExpertProfileService: Symbol.for("ExpertProfileService"),

  //user
  UserExpertController: Symbol.for("UserExpertController"),
  UserExpertService: Symbol.for("UserExpertService"),


  SlotController:Symbol.for('SlotController'),
  SlotServices:Symbol.for('SlotServices'),
  SlotRepository:Symbol.for('SlotRepository'),
  //booking
  BookingController:Symbol.for('BookingController'),
  BookingService:Symbol.for('BookingService'),
  BookingRepository:Symbol.for('BookingRepository'),

    //review
    ReviewRepository:Symbol.for('ReviewRepository'),
    ReviewService:Symbol.for('ReviewService'),
    ReviewController:Symbol.for('ReviewController'),

    MessageController:Symbol.for('MessageController'),
    MessageService:Symbol.for('MessageService'),
    MessageRepository:Symbol.for('MessageRepository')
};
