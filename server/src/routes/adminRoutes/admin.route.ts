
import express,{ Express } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
const router= express.Router()

router.post('/login',adminAuthController.login)

export default router