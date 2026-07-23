import { Request, Response } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatusById,
  updateOrderManagementById,
  autoConfirmAllOrders,
  updateOrderById,
  deleteOrderById,
  startOrderCallById,
} from "../services/orders.service";

export async function getAllOrders(_req: Request, res: Response) {
  const orders = await getOrders();
  res.json(orders);
}

export async function createNewOrder(req: Request, res: Response) {
  const order = await createOrder(req.body);
  res.status(201).json(order);
}

export async function updateOrderStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;

  const order = await updateOrderStatusById(id, status);
  res.json(order);
}

export async function updateOrderManagement(req: Request, res: Response) {
  const id = req.params.id as string;
  const { notes, aiSummary, callbackAt } = req.body;

  const order = await updateOrderManagementById(id, {
    notes,
    aiSummary,
    callbackAt,
  });

  res.json(order);
}

export async function autoConfirmOrders(_req: Request, res: Response) {
  const orders = await autoConfirmAllOrders();
  res.json(orders);
}
export async function updateOrder(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const order = await updateOrderById(id, req.body);

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update order",
    });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const result = await deleteOrderById(id);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete order",
    });
  }
}

export async function startOrderCall(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const call = await startOrderCallById(id);

    res.status(201).json(call);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to start AI call",
    });
  }
}