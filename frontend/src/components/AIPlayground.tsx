import { useEffect, useState } from "react";

type AIEmployee = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  product: string;
  status: string;
  customer?: {
    name?: string;
  };
};

type AIResponse = {
  reply?: string;
  suggestedStatus?: string | null;
  message?: string;
};

export default function AIPlayground() {
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [employeeId, setEmployeeId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");

  const [reply, setReply] = useState("");
  const [suggestedStatus, setSuggestedStatus] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [employeesResponse, ordersResponse] =
          await Promise.all([
            fetch("http://localhost:4000/ai-employees"),
            fetch("http://localhost:4000/orders"),
          ]);

        if (!employeesResponse.ok || !ordersResponse.ok) {
          throw new Error("Failed to load employees or orders.");
        }

        const employeesData: AIEmployee[] =
          await employeesResponse.json();

        const ordersData: Order[] =
          await ordersResponse.json();

        setEmployees(employeesData);
        setOrders(ordersData);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Could not load data. Make sure the backend server is running."
        );
      }
    }

    loadData();
  }, []);

  async function sendMessage() {
    if (!employeeId) {
      alert("Select an AI employee.");
      return;
    }

    if (!customerMessage.trim()) {
      alert("Write a customer message.");
      return;
    }

    setLoading(true);
    setReply("");
    setSuggestedStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch(
        `http://localhost:4000/ai-engine/simulate/${employeeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerMessage: customerMessage.trim(),
            orderId: orderId || undefined,
          }),
        }
      );

      const data: AIResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate AI response."
        );
      }

      setReply(data.reply || "No reply returned.");
      setSuggestedStatus(data.suggestedStatus ?? null);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate AI response."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">AI Playground</h1>

      <p className="mt-2 text-zinc-500">
        Test an AI employee with a customer message and an optional order.
      </p>

      <div className="mt-8 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <select
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
        >
          <option value="">Select AI employee</option>

          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>

        <select
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
        >
          <option value="">No order selected</option>

          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.customer?.name ?? "Unknown customer"} —{" "}
              {order.product} — {order.status}
            </option>
          ))}
        </select>

        <textarea
          value={customerMessage}
          onChange={(event) =>
            setCustomerMessage(event.target.value)
          }
          placeholder="Write a customer message..."
          className="mt-3 h-36 w-full resize-none rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating..." : "Send to AI"}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-6 max-w-3xl rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {reply && (
        <div className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-[#121214] p-6">
          <p className="text-sm text-zinc-500">AI Reply</p>

          <p className="mt-3 whitespace-pre-wrap text-zinc-200">
            {reply}
          </p>

          <div className="mt-5">
            <p className="text-sm text-zinc-500">
              Suggested Status
            </p>

            <span className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
              {suggestedStatus ?? "No status change"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}