import { Router } from "express";
import {
  login,
  signUp,
  getUserInfo,
  updateUserInfo,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/get-user-info", verifyToken, getUserInfo);
router.patch("/update-user", verifyToken, updateUserInfo);

export default router;
