import {
  CheckCircle2,
  Clock3,
  Phone,
  PhoneCall,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CallStatus =
  | "Confirmed"
  | "No Answer"
  | "Callback"
  | "Cancelled"
  | "In Progress"
  | "Pending";

type Call = {
  id: string;
  customer: string;
  phone: string;
  city: string;
  product: string;
  aiEmployee: string;
  status: CallStatus;
  duration: string;
  createdAt: string;

  transcript?: string;
  summary?: string;
  recordingUrl?: string;
  confidence?: number;
};

const statusStyles: Record<CallStatus, string> = {
  Confirmed: "bg-emerald-500/10 text-emerald-400",
  "No Answer": "bg-red-500/10 text-red-400",
  Callback: "bg-amber-500/10 text-amber-400",
  Cancelled: "bg-zinc-800 text-zinc-400",
  "In Progress": "bg-blue-500/10 text-blue-400",
  Pending: "bg-violet-500/10 text-violet-400",
};

export default function Calls() {
  const [search, setSearch] = useState("");
  const [calls, setCalls] = useState<Call[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | CallStatus>("All");
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadCalls();
  }, []);

  async function loadCalls() {
    try {
      const response = await fetch("http://localhost:4000/calls");

      if (!response.ok) {
        throw new Error("Failed to load calls");
      }

      const data: Call[] = await response.json();
      setCalls(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function startCalls() {
    try {
      const response = await fetch("http://localhost:4000/calls/start", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start calls");
      }

      await loadCalls();
    } catch (error) {
      console.error(error);
    }
  }

  async function simulateCalls() {
    try {
      const response = await fetch("http://localhost:4000/calls/simulate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to simulate calls");
      }

      await loadCalls();
    } catch (error) {
      console.error(error);
    }
  }

  function closeDetails() {
    setDetailsOpen(false);
    setSelectedCall(null);
  }

  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    return calls.filter((call) => {
      const matchesSearch =
        call.customer.toLowerCase().includes(query) ||
        call.phone.toLowerCase().includes(query) ||
        call.city.toLowerCase().includes(query) ||
        call.product.toLowerCase().includes(query) ||
        call.aiEmployee.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || call.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [calls, search, statusFilter]);

  const totalCalls = calls.length;
  const confirmedCalls = calls.filter(
    (call) => call.status === "Confirmed",
  ).length;
  const activeCalls = calls.filter(
    (call) => call.status === "In Progress",
  ).length;
  const failedCalls = calls.filter(
    (call) =>
      call.status === "No Answer" || call.status === "Cancelled",
  ).length;

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-zinc-500">Loading calls...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Call management</p>

          <h1 className="mt-2 text-3xl font-semibold text-white">Calls</h1>

          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Track every AI phone call, customer response and order confirmation.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={startCalls}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
          >
            <PhoneCall size={17} />
            Start Calls
          </button>

          <button
            type="button"
            onClick={simulateCalls}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Simulate AI
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Calls"
          value={totalCalls}
          icon={<Phone size={19} />}
        />

        <StatCard
          label="Active Calls"
          value={activeCalls}
          icon={<Clock3 size={19} />}
        />

        <StatCard
          label="Confirmed"
          value={confirmedCalls}
          icon={<CheckCircle2 size={19} />}
        />

        <StatCard
          label="Failed Calls"
          value={failedCalls}
          icon={<XCircle size={19} />}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, phone, city or product..."
              className="w-full rounded-xl border border-zinc-800 bg-black py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "All" | CallStatus)
            }
            className="rounded-xl border border-zinc-800 bg-black px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Callback">Callback</option>
            <option value="No Answer">No Answer</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-600">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">AI Employee</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Duration</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-zinc-900 transition hover:bg-zinc-900/50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">
                      {call.customer}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {call.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {call.product}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {call.aiEmployee}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[call.status]
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-400">
                    {call.duration}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-400">
                    {formatDate(call.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCall(call);
                        setDetailsOpen(true);
                      }}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCalls.length === 0 && (
            <div className="px-5 py-14 text-center text-sm text-zinc-500">
              No calls found.
            </div>
          )}
        </div>
      </div>

      {detailsOpen && selectedCall && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <button
            type="button"
            aria-label="Close call details"
            onClick={closeDetails}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative h-full w-full max-w-[500px] overflow-y-auto border-l border-zinc-800 bg-[#0b0b0c] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Call information</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Call Details
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
              >
                Close
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="text-sm font-medium text-zinc-400">
                Customer
              </h3>

              <div className="mt-4 space-y-3">
                <DetailRow
                  label="Name"
                  value={selectedCall.customer || "Unknown"}
                />
                <DetailRow
                  label="Phone"
                  value={selectedCall.phone || "-"}
                />
                <DetailRow
                  label="City"
                  value={selectedCall.city || "-"}
                />
                <DetailRow
                  label="Product"
                  value={selectedCall.product || "-"}
                />
                <DetailRow
                  label="AI Employee"
                  value={selectedCall.aiEmployee || "-"}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="text-sm font-medium text-zinc-400">
                Call status
              </h3>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500">Current status</p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[selectedCall.status]
                    }`}
                  >
                    {selectedCall.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-zinc-500">Duration</p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {selectedCall.duration}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-zinc-800 pt-4">
                <p className="text-xs text-zinc-500">Date</p>
                <p className="mt-2 text-sm text-white">
                  {formatDate(selectedCall.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="text-sm font-medium text-zinc-400">Timeline</h3>

              <div className="mt-5 space-y-4">
                <TimelineItem
                  dotClassName="bg-emerald-500"
                  title="AI started the call"
                  description={formatDate(selectedCall.createdAt)}
                />

                <TimelineItem
                  dotClassName="bg-blue-500"
                  title="Customer answered"
                  description="Conversation in progress..."
                />

                <TimelineItem
                  dotClassName="bg-violet-500"
                  title="Call finished"
                  description={`Duration: ${selectedCall.duration}`}
                />
              </div>
            </div>
            {/* Call Recording */}
<div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
  <h3 className="text-sm font-medium text-zinc-400">
    Call Recording
  </h3>

  <audio
    controls
    className="mt-4 w-full"
    src={selectedCall.recordingUrl ?? ""}
  />
</div>

{/* AI Transcript */}
<div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
  <h3 className="text-sm font-medium text-zinc-400">
    AI Transcript
  </h3>

  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
    {selectedCall.transcript ?? "No transcript available."}
  </p>
</div>

{/* AI Analysis */}
<div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
  <h3 className="text-sm font-medium text-zinc-400">
    AI Analysis
  </h3>

  <div className="mt-4 rounded-xl bg-zinc-950 p-4">
    <p className="text-sm leading-7 text-white">
      {selectedCall.summary ?? "No analysis available."}
    </p>
  </div>

  <div className="mt-4 flex items-center justify-between">
    <span className="text-xs text-zinc-500">
      Confidence
    </span>

    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
      {selectedCall.confidence ?? 0}%
    </span>
  </div>
</div>
          </aside>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>

        <div className="rounded-xl border border-zinc-800 bg-black p-2 text-zinc-400">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}

type TimelineItemProps = {
  dotClassName: string;
  title: string;
  description: string;
};

function TimelineItem({
  dotClassName,
  title,
  description,
}: TimelineItemProps) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotClassName}`}
      />

      <div>
        <p className="text-sm text-white">{title}</p>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}