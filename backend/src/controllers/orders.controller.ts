import { Request, Response } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatusById,
  autoConfirmAllOrders,
} from "../services/orders.service";

export async function getAllOrders(
  _req: Request,
  res: Response
) {
  const orders = await getOrders();
  res.json(orders);
}

export async function createNewOrder(
  req: Request,
  res: Response
) {
  const order = await createOrder(req.body);

  res.status(201).json(order);
}
export async function updateOrderStatus(
  req: Request,
  res: Response
) {
  const id = req.params.id as string;
  const { status } = req.body;

  const order = await updateOrderStatusById(id, status);

  res.json(order);
}
export async function autoConfirmOrders(
  _req: Request,
  res: Response
) {
  const orders = await autoConfirmAllOrders();
  res.json(orders);
}