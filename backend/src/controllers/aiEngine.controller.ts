import { Request, Response } from "express";
import {
  buildEmployeePrompt,
  simulateEmployeeResponse,
} from "../services/aiEngine.service";

export async function generateEmployeePrompt(
  req: Request,
  res: Response
) {
  const employeeId = req.params.employeeId as string;
  const orderId =
    typeof req.query.orderId === "string"
      ? req.query.orderId
      : undefined;

  try {
    const prompt = await buildEmployeePrompt(
      employeeId,
      orderId
    );

    res.json({ prompt });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate prompt",
    });
  }
}
export async function simulateResponse(
  req: Request,
  res: Response
) {
  const employeeId = req.params.employeeId as string;
  const { customerMessage, orderId } = req.body;

  try {
    const result = await simulateEmployeeResponse(
      employeeId,
      customerMessage,
      orderId
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to simulate AI response",
    });
  }
}