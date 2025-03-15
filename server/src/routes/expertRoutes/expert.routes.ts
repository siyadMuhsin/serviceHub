import express from "express";
import multer from "multer";
import ExpertController from "../../controllers/Expert/expert.controller";
import verifyToken from "../../middlewares/authMiddleware";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.single("certificate"),verifyToken,ExpertController.createExpert);


export default router;
// function test(req,res){
//     console.log(req.file)
//     console.log('working')

// }