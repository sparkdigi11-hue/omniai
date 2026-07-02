import { useEffect, useState } from "react";
import Papa from "papaparse";
import AddTestOrder from "./components/AddTestOrder";
import {
  Bell,
  Bot,
  Brain,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileSpreadsheet,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Plug,
  Search,
  Upload,
  Users,
  Workflow,
  Play,
  BookOpen,
  Package,
  ShieldCheck,
  Mic,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Order = {
  id: number;
  name: string;
  phone: string;
  product: string;
  city: string;
  price: string;
  status: string;
};

type MenuItem = [string, LucideIcon];

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [started, setStarted] = useState(false);
  useEffect(() => {
  async function loadOrders() {
    const response = await fetch("http://localhost:4000/orders");
    const data = await response.json();
    setOrders(data);
    console.log(data);
  }

  loadOrders();
}, []);

  const menu: MenuItem[] = [
    ["Dashboard", Brain],
    ["AI Employees", Bot],
    ["Knowledge Base", BookOpen],
    ["Orders", Package],
    ["Products", FileSpreadsheet],
    ["Calls", Phone],
    ["WhatsApp", MessageCircle],
    ["Instagram", Globe],
    ["Email", Mail],
    ["Workflows", Workflow],
    ["API", Plug],
    ["Team", Users],
    ["Billing", CreditCard],
  ];

  function handleCSV(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data as Record<string, string>[];

        const cleanOrders: Order[] = rows.map((row, index) => ({
          id: index + 1,
          name: row.name || row.Name || "Unknown",
          phone: row.phone || row.Phone || row.telephone || "",
          product: row.product || row.Product || "Product",
          city: row.city || row.City || "",
          price: row.price || row.Price || "",
          status: "Ready",
        }));

        setOrders(cleanOrders);
        setStarted(false);
      },
    });
  }

  function startAutoCalls() {
    setStarted(true);

    setOrders((prev) =>
      prev.map((order, index) => ({
        ...order,
        status:
          index % 4 === 0
            ? "Confirmed"
            : index % 4 === 1
            ? "No Answer"
            : index % 4 === 2
            ? "Callback"
            : "Confirmed",
      }))
    );
  }

  const confirmed = orders.filter((order) => order.status === "Confirmed").length;
  const noAnswer = orders.filter((order) => order.status === "No Answer").length;
  const callback = orders.filter((order) => order.status === "Callback").length;

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <aside className="fixed left-0 top-0 h-screen w-[230px] overflow-y-auto border-r border-white/10 bg-[#0f0f10] p-4">
        <div className="px-2 py-4">
          <h1 className="text-xl font-semibold tracking-tight">OmniAI</h1>
          <p className="mt-1 text-xs text-zinc-500">AI Employee Platform</p>
        </div>

        <nav className="mt-4 space-y-1 pb-8">
          {menu.map(([label, Icon], index) => (
            <button
              key={label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                index === 0
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="ml-[230px] min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0b0c]/90 px-7 backdrop-blur">
          <div className="flex w-[460px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-500">
            <Search size={16} />
            Search orders, employees, calls...
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              Ask AI
            </button>
            <Bell size={19} className="text-zinc-500" />
            <div className="h-9 w-9 rounded-full bg-zinc-800" />
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-8 py-12">
          <p className="text-sm text-zinc-500">AI Communication Platform</p>

          <h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-tight">
            Import orders. OmniAI confirms them automatically.
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-4">
            {[
              ["Imported orders", orders.length],
              ["Confirmed", confirmed],
              ["No answer", noAnswer],
              ["Callback", callback],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-zinc-500">{title}</p>
                <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-[#121214] p-5">
          <AddTestOrder />
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Upload orders</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Required columns: name, phone, product, city, price
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                <Upload size={16} />
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleCSV(file);
                  }}
                />
              </label>
            </div>

            {orders.length > 0 && (
              <button
                onClick={startAutoCalls}
                className="mt-5 flex items-center gap-2 rounded-xl bg-[#10A37F] px-4 py-2 text-sm font-medium text-white"
              >
                <Play size={16} />
                Start Auto Confirmation
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <Bot size={20} />
                <h3 className="text-lg font-medium">AI Employees</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Create AI employees for confirmation, sales, support, and
                follow-up calls.
              </p>
              <button className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                + Hire AI Employee
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <BookOpen size={20} />
                <h3 className="text-lg font-medium">Knowledge Base</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Add products, FAQ, delivery rules, store policies, and forbidden
                answers.
              </p>
              <button className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300">
                Train AI
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <Mic size={20} />
                <h3 className="text-lg font-medium">Voice AI</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                AI speaks with customers, answers questions, confirms orders,
                and writes summaries.
              </p>
              <button className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300">
                Configure Voice
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Orders queue</h3>
              <p className="text-sm text-zinc-500">
                {started ? "Auto confirmation started" : "Waiting for CSV"}
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500">
                        Upload a CSV file to start.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-white/10 text-zinc-300"
                      >
                        <td className="p-3">{order.name}</td>
                        <td className="p-3">{order.phone}</td>
                        <td className="p-3">{order.product}</td>
                        <td className="p-3">{order.city}</td>
                        <td className="p-3">{order.price}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs">
                            {order.status === "Confirmed" ? (
                              <CheckCircle2
                                size={14}
                                className="text-[#10A37F]"
                              />
                            ) : order.status === "Ready" ? (
                              <ShieldCheck
                                size={14}
                                className="text-zinc-500"
                              />
                            ) : (
                              <Clock3 size={14} className="text-zinc-500" />
                            )}
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}