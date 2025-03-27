import express from 'express';
import container from '../di/container';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { ITokenController } from '../core/interfaces/controllers/ITokenController';
import { IAuthMiddleware } from '../core/interfaces/middleware/IAuthMiddleware';

import { TYPES } from '../di/types';

const router = express.Router();
//middleware
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const authController = container.get<IAuthController>(TYPES.AuthController);
const tokenController = container.get<ITokenController>(TYPES.TokenController);

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/verify-otp', authController.verifyOtp.bind(authController));
router.post('/resent-otp', authController.resendOtp.bind(authController));
router.post('/logout', authMiddleware.verifyToken.bind(authMiddleware), authController.logoutUser.bind(authController));
router.post('/forgot-password', authController.forgetPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/google-signin', authController.googleSignIn.bind(authController));
router.get('/me', authMiddleware.verifyToken.bind(authMiddleware), authController.getCurrentUser.bind(authController));
router.post('/refresh', tokenController.userRefreshToken.bind(tokenController));

export default router;