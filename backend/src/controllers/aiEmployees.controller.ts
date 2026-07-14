import { Request, Response } from "express";
import {
  getAIEmployees,
  createAIEmployee,
  updateAIEmployeeById,
} from "../services/aiEmployees.service";

export async function getAllAIEmployees(
  _req: Request,
  res: Response
) {
  const employees = await getAIEmployees();
  res.json(employees);
}

export async function createNewAIEmployee(
  req: Request,
  res: Response
) {
  const employee = await createAIEmployee(req.body);
  res.status(201).json(employee);
}

export async function updateAIEmployee(
  req: Request,
  res: Response
) {
  const id = req.params.id as string;

  const employee = await updateAIEmployeeById(id, req.body);

  res.json(employee);
}