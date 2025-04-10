import { Router } from "express";
import { searchContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/search-contacts", verifyToken, searchContacts);

export default router;
