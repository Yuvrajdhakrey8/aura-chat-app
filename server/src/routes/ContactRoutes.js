import { Router } from "express";
import {
  getContactsForDMList,
  searchContacts,
} from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessagesController.js";

const router = Router();

router.post("/search-contacts", verifyToken, searchContacts);
router.post("/get-messages", verifyToken, getMessages);
router.get("/get-dm-list", verifyToken, getContactsForDMList);

export default router;
