import type { Request, Response } from "express";
import {
  createNewCall,
  deleteExistingCall,
  getAllCalls,
  startPendingOrderCalls,
  updateExistingCall,
  simulatePendingCalls,
} from "../services/calls.service";

export async function getCalls(_req: Request, res: Response) {
  try {
    const calls = await getAllCalls();

    res.json(calls);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load calls",
    });
  }
}

export async function createCall(req: Request, res: Response) {
  try {
    const call = await createNewCall(req.body);

    res.status(201).json(call);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create call",
    });
  }
}

export async function startCalls(_req: Request, res: Response) {
  try {
    const result = await startPendingOrderCalls();

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to start calls",
    });
  }
}
export async function simulateCalls(_req: Request, res: Response) {
  try {
    const result = await simulatePendingCalls();

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to simulate calls",
    });
  }
}
export async function updateCall(req: Request, res: Response) {
  try {
    console.log("SIMULATE ROUTE CALLED");
    const id = String(req.params.id);

    const call = await updateExistingCall(id, req.body);

    res.json(call);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update call",
    });
  }
}

export async function deleteCall(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    await deleteExistingCall(id);

    res.json({
      message: "Call deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete call",
    });
  }
}