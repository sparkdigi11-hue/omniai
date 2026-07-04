import { Router } from "express";
import {
  getAllOrders,
  createNewOrder,
  updateOrderStatus,
  autoConfirmOrders,
} from "../controllers/orders.controller";

const router = Router();

router.get("/", getAllOrders);

router.post("/", createNewOrder);
router.post("/auto-confirm", autoConfirmOrders);

export default router;