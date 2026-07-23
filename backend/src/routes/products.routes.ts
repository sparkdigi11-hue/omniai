import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router = Router();

router.get("/", getAllProducts);

router.post("/", createProduct);

router.patch("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;