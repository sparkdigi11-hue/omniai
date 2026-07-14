import { Router } from "express";
import {
  getAllAIEmployees,
  createNewAIEmployee,
  updateAIEmployee,
} from "../controllers/aiEmployees.controller";

const router = Router();

router.get("/", getAllAIEmployees);
router.post("/", createNewAIEmployee);
router.patch("/:id", updateAIEmployee);

export default router;