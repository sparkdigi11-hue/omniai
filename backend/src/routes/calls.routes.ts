import { Router } from "express";
import {
  getCalls,
  createCall,
  updateCall,
  deleteCall,
  startCalls,
  simulateCalls,
} from "../controllers/calls.controller";

const router = Router();

router.get("/", getCalls);
router.post("/start", startCalls);
router.post("/simulate", simulateCalls);
router.post("/", createCall);
router.patch("/:id", updateCall);
router.delete("/:id", deleteCall);

export default router;