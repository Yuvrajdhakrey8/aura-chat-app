import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/profiles";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${now}-${safeName}`);
  },
});

export const upload = multer({ storage });
