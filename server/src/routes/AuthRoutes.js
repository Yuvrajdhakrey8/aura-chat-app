import { Router } from "express";
import {
  login,
  signUp,
  getUserInfo,
  updateUserInfo,
  logOutUser,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/get-user-info", verifyToken, getUserInfo);
router.post("/logout", logOutUser);
router.patch(
  "/update-user",
  verifyToken,
  upload.single("profileImage"),
  updateUserInfo
);
export default router;
