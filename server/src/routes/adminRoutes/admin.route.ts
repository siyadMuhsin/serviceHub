
import express,{ Express } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
import { verifyAdmin } from "../../middlewares/adminSecure";
const router= express.Router()

router.post('/login',adminAuthController.login)
router.post('/logout',adminAuthController.logout)
router.get('/',verifyAdmin,adminAuthController.checkAdmin)

export default router