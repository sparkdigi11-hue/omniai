import { Router } from "express";
import {
  getAllOrders,
  createNewOrder,
} from "../controllers/orders.controller";

const router = Router();

router.get("/", getAllOrders);

router.post("/", createNewOrder);

export default router;