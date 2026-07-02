import { Request, Response } from "express";
import { getOrders } from "../services/orders.service";

export async function getAllOrders(
  req: Request,
  res: Response
) {
  const orders = await getOrders();

  res.json(orders);
}