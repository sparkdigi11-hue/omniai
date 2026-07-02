import { Request, Response } from "express";
import csv from "csv-parser";
import { Readable } from "stream";
import { importCSVRows } from "../services/csv.service";

export async function uploadCSV(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No CSV file uploaded",
    });
  }

  const rows: any[] = [];
  const stream = Readable.from(req.file.buffer);

  stream
    .pipe(csv())
    .on("data", (data) => {
      rows.push(data);
    })
    .on("end", async () => {
      const imported = await importCSVRows(rows);

      res.json({
        success: true,
        imported,
      });
    });
}