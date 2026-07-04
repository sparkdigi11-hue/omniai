import { useState } from "react";

type Order = {
  id: string;
  product: string;
  price: string;
  status: string;
  notes?: string | null;
  aiSummary?: string | null;
  callbackAt?: string | null;
  customer?: {
    name?: string;
    phone?: string;
    city?: string;
  };
};

type Props = {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: string) => void;
  onOrderUpdated: (updatedOrder: Order) => void;
};

export default function OrdersTable({ orders, onUpdateStatus, onOrderUpdated }: Props) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [callbackAt, setCallbackAt] = useState("");

  const displayedOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  async function saveManagement() {
    if (!selectedOrder) return;

    const response = await fetch(
      `http://localhost:4000/orders/${selectedOrder.id}/management`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
          aiSummary,
          callbackAt: callbackAt || null,
        }),
      }
    );

    const updatedOrder = await response.json();
    setSelectedOrder(updatedOrder);
    onOrderUpdated(updatedOrder);

    alert("Order management saved");
  }

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Orders Queue</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Manage imported customer orders.
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Confirmed", "No Answer", "Callback"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                statusFilter === status
                  ? "bg-white text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <p className="text-sm text-zinc-500">{orders.length} orders</p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-zinc-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Product</th>
              <th className="p-3">City</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {displayedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-zinc-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              displayedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setOrderStatus(order.status);
                    setNotes(order.notes ?? "");
                    setAiSummary(order.aiSummary ?? "");
                    setCallbackAt(order.callbackAt?.slice(0, 16) ?? "");
                  }}
                  className="cursor-pointer border-t border-white/10 text-zinc-300 hover:bg-white/[0.03]"
                >
                  <td className="p-3">{order.customer?.name ?? "-"}</td>
                  <td className="p-3">{order.customer?.phone ?? "-"}</td>
                  <td className="p-3">{order.product}</td>
                  <td className="p-3">{order.customer?.city ?? "-"}</td>
                  <td className="p-3">{order.price}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "Confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : order.status === "No Answer"
                          ? "bg-red-500/20 text-red-400"
                          : order.status === "Callback"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed right-0 top-0 z-50 h-screen w-[420px] overflow-y-auto border-l border-white/10 bg-[#121214] p-6 shadow-2xl">
          <button
            onClick={() => setSelectedOrder(null)}
            className="mb-6 rounded-lg bg-white/10 px-3 py-1 text-sm text-zinc-300"
          >
            Close
          </button>

          <h2 className="text-xl font-semibold">Order Details</h2>

          <div className="mt-6 space-y-4 text-sm">
            <p><span className="text-zinc-500">Name:</span> {selectedOrder.customer?.name}</p>
            <p><span className="text-zinc-500">Phone:</span> {selectedOrder.customer?.phone}</p>
            <p><span className="text-zinc-500">City:</span> {selectedOrder.customer?.city}</p>
            <p><span className="text-zinc-500">Product:</span> {selectedOrder.product}</p>
            <p><span className="text-zinc-500">Price:</span> {selectedOrder.price}</p>

            <div>
              <label className="mb-2 block text-zinc-500">Status</label>
              <select
                value={orderStatus}
                onChange={(e) => {
                  setOrderStatus(e.target.value);
                  onUpdateStatus(selectedOrder.id, e.target.value);
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <option>Confirmed</option>
                <option>No Answer</option>
                <option>Callback</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-zinc-500">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-24 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
                placeholder="Customer notes..."
              />
            </div>

            <div>
              <label className="mb-2 block text-zinc-500">AI Summary</label>
              <textarea
                value={aiSummary}
                onChange={(e) => setAiSummary(e.target.value)}
                className="h-24 w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
                placeholder="AI call summary..."
              />
            </div>

            <div>
              <label className="mb-2 block text-zinc-500">Callback Time</label>
              <input
                type="datetime-local"
                value={callbackAt}
                onChange={(e) => setCallbackAt(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={saveManagement}
              className="w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Save Order Management
            </button>
          </div>
        </div>
      )}
    </div>
  );
}