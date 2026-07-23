import { Router } from "express";
import {
  getAllOrders,
  createNewOrder,
  updateOrderStatus,
  updateOrderManagement,
  autoConfirmOrders,
  updateOrder,
  deleteOrder,
  startOrderCall,
} from "../controllers/orders.controller";

const router = Router();

router.get("/", getAllOrders);
router.post("/", createNewOrder);

router.post("/auto-confirm", autoConfirmOrders);

router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/management", updateOrderManagement);

router.post("/:id/start-call", startOrderCall);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;