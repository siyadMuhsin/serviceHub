import express from "express";
import multer from "multer";
import ExpertController from "../../controllers/Expert/expert.controller";
import verifyToken from "../../middlewares/authMiddleware";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.single("certificate"),verifyToken,ExpertController.createExpert);
// router.get("/", ExpertController.getExperts);
// router.get("/:id", ExpertController.getExpertById);
// router.put("/:id", ExpertController.updateExpert);
// router.delete("/:id", ExpertController.deleteExpert);

export default router;
// function test(req,res){
//     console.log(req.file)
//     console.log('working')

// }