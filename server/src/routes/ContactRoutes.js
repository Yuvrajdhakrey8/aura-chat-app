import { Router } from "express";
import {
  getAllContacts,
  getContactsForDMList,
  searchContacts,
  uploadFiles,
} from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  deleteMessage,
  getMessages,
} from "../controllers/MessagesController.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "/uploads/files" });

router.post("/search-contacts", verifyToken, searchContacts);
router.post("/get-messages", verifyToken, getMessages);
router.get("/get-dm-list", verifyToken, getContactsForDMList);
router.get("/get-all-contacts", verifyToken, getAllContacts);
router.post("/upload-files", verifyToken, upload.single("file"), uploadFiles);
router.delete("/messages/:messageId", verifyToken, deleteMessage);

export default router;
