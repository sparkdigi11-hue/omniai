import { Router } from "express";
import { getAllOrders } from "../controllers/orders.controller";

const router = Router();

router.get("/", getAllOrders);

export default router;