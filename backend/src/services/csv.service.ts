import { createOrder } from "./orders.service";

export async function importCSVRows(rows: any[]) {
  for (const row of rows) {
    await createOrder({
      name: row.name,
      phone: row.phone,
      city: row.city,
      product: row.product,
      price: row.price,
    });
  }

  return rows.length;
}