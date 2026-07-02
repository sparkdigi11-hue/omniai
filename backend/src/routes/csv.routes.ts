import { Router } from "express";
import multer from "multer";
import { uploadCSV } from "../controllers/csv.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/upload", upload.single("file"), uploadCSV);

export default router;