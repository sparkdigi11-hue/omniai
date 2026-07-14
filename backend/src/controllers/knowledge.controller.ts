import { Request, Response } from "express";
import {
  getKnowledgeItems,
  createKnowledgeItem,
  updateKnowledgeItemById,
} from "../services/knowledge.service";

export async function getAllKnowledgeItems(
  _req: Request,
  res: Response
) {
  const items = await getKnowledgeItems();
  res.json(items);
}

export async function createNewKnowledgeItem(
  req: Request,
  res: Response
) {
  const item = await createKnowledgeItem(req.body);
  res.status(201).json(item);
}

export async function updateKnowledgeItem(
  req: Request,
  res: Response
) {
  const id = req.params.id as string;

  const item = await updateKnowledgeItemById(
    id,
    req.body
  );

  res.json(item);
}