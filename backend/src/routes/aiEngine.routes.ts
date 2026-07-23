import { Router } from "express";
import {
  generateEmployeePrompt,
  simulateResponse,
} from "../controllers/aiEngine.controller";
const router = Router();

router.get("/prompt/:employeeId", generateEmployeePrompt);
router.post("/simulate/:employeeId", simulateResponse);

export default router;