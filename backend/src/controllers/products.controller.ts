import { Request, Response } from "express";
import {
  getProducts,
  createProduct as createProductService,
  updateProductById,
  deleteProductById,
} from "../services/products.service";

export async function getAllProducts(_req: Request, res: Response) {
  const products = await getProducts();
  res.json(products);
}

export async function createProduct(req: Request, res: Response) {
  const product = await createProductService(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const id = req.params.id as string;

  const product = await updateProductById(id, req.body);
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const id = req.params.id as string;

  await deleteProductById(id);

  res.json({
    success: true,
  });
}