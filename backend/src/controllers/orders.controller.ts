import { Request, Response } from "express";
import { getOrders, createOrder } from "../services/orders.service";

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