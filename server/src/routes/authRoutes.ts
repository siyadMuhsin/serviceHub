

import express from 'express';
import AuthController from '../controllers/AuthController';

const router = express.Router();

// Use static methods
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-otp',AuthController.verifyOtp)
router.post('/resent-otp',AuthController.resendOtp)

export default router;