import type { Order } from "../types/order";

export function parseOrders(rows: Record<string, string>[]): Order[] {
  return rows.map((row, index) => ({
    id: index + 1,
    name: row.name || row.Name || "Unknown",
    phone: row.phone || row.Phone || row.telephone || "",
    product: row.product || row.Product || "Product",
    city: row.city || row.City || "",
    price: row.price || row.Price || "",
    status: "Ready",
  }));
}