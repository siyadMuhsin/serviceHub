

import express from 'express';
import AuthController from '../controllers/AuthController';
import verifyToken from '../middlewares/authMiddleware';
// import TokenController from '../controllers/Token.controller';
import TokenController from '../controllers/Token.controller';

const router = express.Router();

// Use static methods
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-otp',AuthController.verifyOtp)
router.post('/resent-otp',AuthController.resendOtp)
router.post('/logout',verifyToken,AuthController.logoutUser)


router.post('/forgot-password',AuthController.forgetPassword)
router.post('/reset-password',AuthController.resetPassword)
router.post('/google-signin',AuthController.googleSignIn)
router.get('/me',verifyToken,AuthController.getCurrentUser)


router.post('/refresh', TokenController.userRefreshToken);

// create expert account
router.post('/experts/create')

export default router;