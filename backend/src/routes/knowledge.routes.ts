import { Router } from "express";
import {
  getAllKnowledgeItems,
  createNewKnowledgeItem,
  updateKnowledgeItem,
} from "../controllers/knowledge.controller";

const router = Router();

router.get("/", getAllKnowledgeItems);
router.post("/", createNewKnowledgeItem);
router.patch("/:id", updateKnowledgeItem);

export default router;