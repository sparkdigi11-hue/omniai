import { useEffect, useState } from "react";
import AIEmployees from "./features/AIEmployees";
import Orders from "./features/Orders";
import KnowledgeBase from "./features/KnowledgeBase";
import AIPlayground from "./components/AIPlayground";
import Conversations from "./components/Conversations";
import Products from "./features/Products";
import Calls from "./features/Calls";
import WhatsApp from "./components/WhatsApp";
import Instagram from "./components/Instagram";
import Email from "./components/Email";
import Workflows from "./components/Workflows";
import API from "./components/API";
import Team from "./components/Team";
import Billing from "./components/Billing";
import OrdersTable from "./components/OrdersTable";
import {
  Bell,
  Bot,
  Brain,
  CreditCard,
  FileSpreadsheet,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Plug,
  Search,
  Users,
  Workflow,
  BookOpen,
  Package,
Clock3,
CheckCircle2,
PhoneCall,
TrendingUp,
AlertCircle,
CalendarClock,
Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { LucideIcon } from "lucide-react";

type Order = {
  id: string;
  product: string;
  price: string;
  status: string;
  callStatus: string;
  notes?: string | null;
  aiSummary?: string | null;
  callbackAt?: string | null;
  events?: {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    createdAt: string;
  }[];
  customer?: {
    name?: string;
    phone?: string;
    city?: string;
  };
};


type MenuItem = [string, LucideIcon];

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setStarted] = useState(false);
  const [callsSearch, setCallsSearch] = useState("");
  const [callsFilter, setCallsFilter] = useState("All");
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [csvInputKey, setCsvInputKey] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [backendOnline, setBackendOnline] = useState(true);
 

  async function loadOrders() {
  try {
    const response = await fetch("http://localhost:4000/orders");

    if (!response.ok) {
      throw new Error("Failed to load orders");
    }

    const data = await response.json();
    setOrders(data);
    setLastSync(new Date());
    setBackendOnline(true);
  } catch (error) {
    console.error("Load orders error:", error);
    setBackendOnline(false);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadOrders();

  const intervalId = window.setInterval(() => {
    loadOrders();
  }, 1000);

  return () => {
    window.clearInterval(intervalId);
  };
}, []);

  const menu: MenuItem[] = [
    ["Dashboard", Brain],
    ["AI Employees", Bot],
    ["AI Playground", Bot],
    ["Conversations", MessageCircle],
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

  async function startAutoCalls() {
  setStarted(true);

  const response = await fetch("http://localhost:4000/orders/auto-confirm", {
    method: "POST",
  });

  const data = await response.json();

  setOrders(data);
  setLoading(false);
}
    async function updateOrderStatus(orderId: string, status: string) {
  const response = await fetch(
    `http://localhost:4000/orders/status/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );
  const updatedOrder = await response.json();

  setOrders((prev) =>
    prev.map((order) =>
      order.id === orderId ? updatedOrder : order
    )
  );
}

  const confirmed = orders.filter(
  (order) => order.callStatus === "Confirmed"
).length;

const noAnswer = orders.filter(
  (order) => order.callStatus === "No Answer"
).length;

const callback = orders.filter(
  (order) => order.callStatus === "Callback"
).length;
const pending = orders.filter(
  (order) => order.callStatus === "Pending"
).length;

const successRate =
  orders.length === 0
    ? 0
    : Math.round((confirmed / orders.length) * 100);
    const today = new Date();

const todayOrders = orders.filter((order) =>
  order.events?.some((event) => {
    const eventDate = new Date(event.createdAt);

    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  })
).length;

const todayConfirmed = orders.filter(
  (order) =>
    order.callStatus === "Confirmed" &&
    order.events?.some((event) => {
      const eventDate = new Date(event.createdAt);

      return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    })
).length;

const needsFollowUp = orders.filter(
  (order) =>
    order.callStatus === "No Answer" ||
    order.callStatus === "Callback"
).length;

const automationCoverage =
  orders.length === 0
    ? 0
    : Math.round(
        (orders.filter(
          (order) =>
            order.callStatus &&
            order.callStatus !== "Pending"
        ).length /
          orders.length) *
          100
      );
      const aiEmployees = 0;

const activeCalls = orders.filter(
  (order) => order.callStatus === "In Progress"
).length;

const pendingOrders = orders.filter(
  (order) => order.callStatus === "Pending"
).length;
const chartData = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();

  date.setDate(date.getDate() - (6 - index));
  date.setHours(0, 0, 0, 0);

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const ordersForDay = orders.filter((order) =>
    order.events?.some((event) => {
      const eventDate = new Date(event.createdAt);

      return eventDate >= date && eventDate < nextDate;
    })
  );

  const confirmedForDay = ordersForDay.filter(
    (order) => order.callStatus === "Confirmed"
  ).length;

  return {
    day: date.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    orders: ordersForDay.length,
    confirmed: confirmedForDay,
  };
});
  const filteredOrders = orders;
  const recentEvents = orders
  .flatMap((order) =>
    (order.events ?? []).map((event) => ({
      ...event,
      customer: order.customer?.name ?? "Unknown customer",
    }))
  )
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 8);
  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0c]">
      <p className="text-zinc-500">Loading OmniAI...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <aside className="fixed left-0 top-0 h-screen w-[230px] overflow-y-auto border-r border-white/10 bg-[#0f0f10] p-4">
        <div className="px-2 py-4">
          <h1 className="text-xl font-semibold tracking-tight">OmniAI</h1>
          <p className="mt-1 text-xs text-zinc-500">AI Employee Platform</p>
        </div>

        <nav className="mt-4 space-y-1 pb-8">
          {menu.map(([label, Icon]) => (
  <button
    key={label}
    type="button"
    onClick={() => setActivePage(label)}
    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
      activePage === label
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
          <div className="flex w-[460px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
            <Search size={16} className="text-zinc-500" />
           <input
  type="text"
  placeholder="Search orders, customers, calls..."
  value={callsSearch}
  onChange={(e) => setCallsSearch(e.target.value)}
  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
/>
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
         {activePage === "AI Employees" ? (
  <AIEmployees />
) : activePage === "AI Playground" ? (
  <AIPlayground />
) : activePage === "Conversations" ? (
  <Conversations />
) : activePage === "Knowledge Base" ? (
  <KnowledgeBase />
) : activePage === "Dashboard" ? (
  <>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
  <div>
    <p className="text-sm text-zinc-500">
      AI Communication Platform
    </p>

    <h2 className="mt-3 max-w-4xl text-5xl font-semibold leading-tight tracking-tight">
      Import orders. OmniAI confirms them automatically.
    </h2>

    <p className="mt-4 max-w-2xl text-zinc-500">
      Manage AI employees, monitor live calls and automate customer
      confirmations from one dashboard.
    </p>
    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
  <span className="rounded-full border border-white/10 px-3 py-1">
    {orders.length} Orders
  </span>

  <span className="rounded-full border border-white/10 px-3 py-1">
    Last Sync:{" "}
    {lastSync
      ? lastSync.toLocaleTimeString()
      : "--:--:--"}
  </span>

  <span
    className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
      backendOnline
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
        : "border-red-500/20 bg-red-500/10 text-red-400"
    }`}
  >
    <span
      className={`h-2 w-2 rounded-full ${
        backendOnline ? "bg-emerald-400" : "bg-red-400"
      }`}
    />

    Backend {backendOnline ? "Online" : "Offline"}
  </span>
</div>
  </div>

  <div className="flex flex-wrap gap-3">
    <button
  type="button"
  onClick={() => setActivePage("Orders")}
  className="rounded-xl bg-[#10A37F] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
>
  + New Order
</button>

    <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
  Upload CSV

  <input
    key={csvInputKey}
    type="file"
    accept=".csv"
    className="hidden"
    onChange={async (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:4000/csv/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("CSV upload failed");
        }

        await loadOrders();
        setCsvInputKey((previous) => previous + 1);
      } catch (error) {
        console.error("Upload CSV error:", error);
      }
    }}
  />
</label>

    <button
  type="button"
  onClick={startAutoCalls}
  disabled={orders.length === 0}
  className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
>
  Start Calls
</button>

    <button
  type="button"
  onClick={() => setActivePage("AI Employees")}
  className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
>
  Hire AI
</button>
<button
  type="button"
  onClick={loadOrders}
  className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
>
  Refresh
</button>
  </div>
</div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
           {[
  {
    title: "Total orders",
    value: orders.length,
    icon: Package,
  },
  {
    title: "Pending",
    value: pending,
    icon: Clock3,
  },
  {
    title: "Confirmed",
    value: confirmed,
    icon: CheckCircle2,
  },
  {
    title: "No answer",
    value: noAnswer,
    icon: PhoneCall,
  },
  {
    title: "Callback",
    value: callback,
    icon: Phone,
  },
  {
    title: "Success rate",
    value: `${successRate}%`,
    icon: TrendingUp,
  },
].map(({ title, value, icon: Icon }) => (
              <div
                key={title}
                className={`rounded-2xl border p-5 ${
  title === "Confirmed"
    ? "border-green-500/20 bg-green-500/10"
    : title === "Pending"
    ? "border-yellow-500/20 bg-yellow-500/10"
    : title === "No answer"
    ? "border-red-500/20 bg-red-500/10"
    : title === "Callback"
    ? "border-blue-500/20 bg-blue-500/10"
    : title === "Success rate"
    ? "border-emerald-500/20 bg-emerald-500/10"
    : "border-white/10 bg-white/[0.03]"
}`}
              >
                <div className="flex items-start justify-between">
  <div>
    <p className="text-sm text-zinc-500">{title}</p>
    <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
  </div>

  <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
    <Icon size={19} className="text-zinc-300" />
  </div>
</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  {[
    {
      title: "Today's activity",
      value: todayOrders,
      description: "Orders handled today",
      icon: Activity,
    },
    {
      title: "Confirmed today",
      value: todayConfirmed,
      description: "Successful confirmations",
      icon: CheckCircle2,
    },
    {
      title: "Needs follow-up",
      value: needsFollowUp,
      description: "No answer or callback",
      icon: CalendarClock,
    },
    {
      title: "Automation coverage",
      value: `${automationCoverage}%`,
      description: "Orders processed by AI",
      icon: Bot,
    },
  ].map(({ title, value, description, icon: Icon }) => (
    <div
      key={title}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>

          <p className="mt-3 text-2xl font-semibold">
            {value}
          </p>

          <p className="mt-2 text-xs text-zinc-600">
            {description}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
          <Icon size={18} className="text-zinc-300" />
        </div>
      </div>
    </div>
  ))}
</div>
<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-semibold">System Overview</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Current workspace status
      </p>
    </div>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-2xl border border-white/10 p-5">
      <p className="text-sm text-zinc-500">AI Employees</p>

      <p className="mt-3 text-3xl font-bold">
        {aiEmployees}
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 p-5">
      <p className="text-sm text-zinc-500">
        Active Calls
      </p>

      <p className="mt-3 text-3xl font-bold text-blue-400">
        {activeCalls}
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 p-5">
      <p className="text-sm text-zinc-500">
        Pending Orders
      </p>

      <p className="mt-3 text-3xl font-bold text-yellow-400">
        {pendingOrders}
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 p-5">
      <p className="text-sm text-zinc-500">
        Backend
      </p>

      <p
        className={`mt-3 text-3xl font-bold ${
          backendOnline
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {backendOnline ? "Online" : "Offline"}
      </p>
    </div>

  </div>
</div>
<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-semibold">Orders Performance</h3>

      <p className="mt-1 text-sm text-zinc-500">
        Last 7 days
      </p>
    </div>
  </div>

  <div className="mt-6 h-72">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

        <XAxis dataKey="day" stroke="#71717a" />

        <YAxis stroke="#71717a" />

        <Tooltip />
        <Legend />

                <Area
  type="monotone"
  dataKey="orders"
  name="Total Orders"
  stroke="#3b82f6"
  fill="#3b82f633"
/>

<Area
  type="monotone"
  dataKey="confirmed"
  name="Confirmed"
  stroke="#22c55e"
  fill="#22c55e22"
/>
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-semibold">Live Activity</h3>

    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
      LIVE
    </span>
  </div>
  
  <p className="mt-2 text-sm text-zinc-500">
    Latest AI actions across your workspace.
  </p>

 <div className="mt-6 space-y-3">
  {recentEvents.length === 0 ? (
    <div className="rounded-xl border border-white/10 p-4">
      <p className="font-medium">Waiting for activity...</p>

      <p className="mt-1 text-sm text-zinc-500">
        OmniAI will display confirmations, calls and AI actions here.
      </p>
    </div>
  ) : (
    recentEvents.map((event) => {
  const eventType = event.type.toLowerCase();

  const isConfirmed = eventType.includes("confirm");
  const isCallback = eventType.includes("callback");
  const isNoAnswer =
    eventType.includes("no-answer") ||
    eventType.includes("no_answer") ||
    eventType.includes("no answer");
  const isCall = eventType.includes("call");

  const EventIcon = isConfirmed
    ? CheckCircle2
    : isCallback
    ? CalendarClock
    : isNoAnswer
    ? AlertCircle
    : isCall
    ? PhoneCall
    : Activity;

  const iconClass = isConfirmed
    ? "bg-green-500/10 text-green-400"
    : isCallback
    ? "bg-blue-500/10 text-blue-400"
    : isNoAnswer
    ? "bg-red-500/10 text-red-400"
    : isCall
    ? "bg-violet-500/10 text-violet-400"
    : "bg-zinc-500/10 text-zinc-400";

  return (
    <div
      key={event.id}
      className="flex items-start gap-4 rounded-xl border border-white/10 bg-black/10 p-4"
    >
      <div className={`rounded-xl p-2.5 ${iconClass}`}>
        <EventIcon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-white">
              {event.customer}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {event.title}
            </p>

            {event.description && (
              <p className="mt-1 text-sm text-zinc-500">
                {event.description}
              </p>
            )}
          </div>

          <p className="shrink-0 text-xs text-zinc-500">
            {new Date(event.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
})
  )}
</div>
</div>
<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-semibold">Recent Calls</h3>

      <p className="mt-2 text-sm text-zinc-500">
        Latest customer calls and their current status.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setActivePage("Calls")}
      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
    >
      View all calls
    </button>
  </div>
  <div className="mt-5 flex flex-col gap-3 md:flex-row">
  <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <Search size={16} className="text-zinc-500" />

    <input
      type="text"
      placeholder="Search recent calls..."
      value={callsSearch}
      onChange={(e) => setCallsSearch(e.target.value)}
      className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
    />
  </div>

  <select
    value={callsFilter}
    onChange={(e) => setCallsFilter(e.target.value)}
    className="rounded-xl border border-white/10 bg-[#121214] px-4 py-3 text-sm text-zinc-300 outline-none"
  >
    <option value="All">All statuses</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Pending">Pending</option>
    <option value="No Answer">No Answer</option>
    <option value="Callback">Callback</option>
    <option value="In Progress">In Progress</option>
  </select>
</div>
  <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
    {orders.length === 0 ? (
      <div className="p-6 text-center text-sm text-zinc-500">
        No calls available yet.
      </div>
    ) : (
     [...orders]
  .filter((order) => {
    const q = callsSearch.toLowerCase();

    const matchesSearch =
      (order.customer?.name ?? "").toLowerCase().includes(q) ||
      (order.customer?.phone ?? "").toLowerCase().includes(q) ||
      (order.product ?? "").toLowerCase().includes(q);

    const matchesFilter =
      callsFilter === "All" ||
      order.callStatus === callsFilter;

    return matchesSearch && matchesFilter;
  })

  .sort((a, b) => {
    const aDate = a.events?.length
      ? new Date(a.events[a.events.length - 1].createdAt).getTime()
      : 0;

    const bDate = b.events?.length
      ? new Date(b.events[b.events.length - 1].createdAt).getTime()
      : 0;

    return bDate - aDate;
  })
  .slice(0, 5)
  .map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between gap-4 border-b border-white/10 p-4 last:border-b-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-semibold text-white">
  {(order.customer?.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()}
</div>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {order.customer?.name ?? "Unknown customer"}
              </p>

              <p className="mt-1 truncate text-sm text-zinc-500">
                {order.customer?.phone ?? "No phone"} · {order.product}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                {order.events?.length
                  ? new Date(
                      order.events[order.events.length - 1].createdAt
                    ).toLocaleString()
                  : "No call yet"}
              </p>
              <div className="mt-2 flex items-center gap-2">
  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-[10px] font-semibold text-violet-400">
    AI
  </div>

  <p className="text-xs text-zinc-500">
    Handled by Sarah AI
  </p>
</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      order.callStatus === "Confirmed"
        ? "bg-green-500/10 text-green-400"
        : order.callStatus === "No Answer"
        ? "bg-red-500/10 text-red-400"
        : order.callStatus === "Callback"
        ? "bg-blue-500/10 text-blue-400"
        : "bg-yellow-500/10 text-yellow-400"
    }`}
  >
    {order.callStatus}
  </span>

  <button
    onClick={() => setActivePage("Calls")}
    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:bg-white/5"
  >
    Details
  </button>
</div>
        </div>
      ))
    )}
  </div>
</div>
<div className="mt-8 mb-4 flex items-center justify-between">
  <div>
    <h3 className="text-xl font-semibold">Recent Orders</h3>
    <p className="mt-1 text-sm text-zinc-500">
      Latest 5 imported orders.
    </p>
  </div>

  <button
    type="button"
    onClick={() => setActivePage("Orders")}
    className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
  >
    View all orders
  </button>
</div>

          <OrdersTable
  orders={filteredOrders.slice(0, 5)}
  onUpdateStatus={updateOrderStatus}
  onOrderUpdated={(updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }}
/>
        </>
) : activePage === "Orders" ? (
  <Orders />
) : activePage === "Products" ? (
  <Products />
) : activePage === "Calls" ? (
  <Calls />
) : activePage === "WhatsApp" ? (
  <WhatsApp />
) : activePage === "Instagram" ? (
  <Instagram />
) : activePage === "Email" ? (
  <Email />
) : activePage === "Workflows" ? (
  <Workflows />
) : activePage === "API" ? (
  <API />
) : activePage === "Team" ? (
  <Team />
) : activePage === "Billing" ? (
  <Billing />
) : (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">{activePage}</h2>

          <p className="mt-2 text-zinc-500">
            This page is coming soon.
          </p>
        </div>
      )}
    </section>
  </main>
</div>
);
}