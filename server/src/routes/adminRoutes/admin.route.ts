
import express,{ Express } from "express";
import adminAuthController from "../../controllers/Admin/admin.auth.controller";
import { verifyAdmin } from "../../middlewares/adminSecure";
import TokenController from "../../controllers/Token.controller";
const router= express.Router()

router.post('/login',adminAuthController.login)
router.post('/logout',adminAuthController.logout)

router.post('/refresh',TokenController.adminRefreshToken)
router.get('/',verifyAdmin,adminAuthController.checkAdmin)

export default router