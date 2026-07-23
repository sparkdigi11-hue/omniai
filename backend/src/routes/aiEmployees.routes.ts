import { Router } from "express";
import {
  getAllAIEmployees,
  createNewAIEmployee,
  updateAIEmployee,
  deleteAIEmployee,
} from "../controllers/aiEmployees.controller";

const router = Router();

router.get("/", getAllAIEmployees);
router.post("/", createNewAIEmployee);
router.patch("/:id", updateAIEmployee);
router.delete("/:id", deleteAIEmployee);

export default router;