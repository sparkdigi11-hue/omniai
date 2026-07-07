import { Router } from "express";
import {
  getAllAIEmployees,
  createNewAIEmployee,
} from "../controllers/aiEmployees.controller";

const router = Router();

router.get("/", getAllAIEmployees);
router.post("/", createNewAIEmployee);

export default router;