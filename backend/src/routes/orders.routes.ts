import { Router } from "express";
import {
  getAllOrders,
  createNewOrder,
  updateOrderStatus,
  updateOrderManagement,
  autoConfirmOrders,
} from "../controllers/orders.controller";

const router = Router();

router.get("/", getAllOrders);

router.post("/", createNewOrder);

router.post("/auto-confirm", autoConfirmOrders);

router.put("/status/:id", updateOrderStatus);

router.patch("/:id/management", updateOrderManagement);

export default router;