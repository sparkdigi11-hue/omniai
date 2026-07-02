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
  Send,
  Settings,
  Upload,
  Users,
  Workflow,
} from "lucide-react";

export default function App() {
  const sidebar = [
    ["Dashboard", Brain],
    ["AI Agents", Bot],
    ["Calls", Phone],
    ["WhatsApp", MessageCircle],
    ["Instagram", Globe],
    ["Email", Mail],
    ["Workflows", Workflow],
    ["CSV / Excel", FileSpreadsheet],
    ["API", Plug],
    ["Team", Users],
    ["Billing", CreditCard],
    ["Settings", Settings],
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-white/10 bg-[#0f0f10] p-4">
        <div className="px-3 py-4">
          <h1 className="text-xl font-semibold tracking-tight">OmniAI</h1>
          <p className="mt-1 text-xs text-zinc-500">AI workspace</p>
        </div>

        <nav className="mt-4 space-y-1">
          {sidebar.map(([label, Icon]: any, index) => (
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

      <main className="ml-[260px] min-h-screen">
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-8">
          <div className="flex w-[360px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-500">
            <Search size={16} />
            Search workflows, contacts, calls...
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
              Ask OmniAI
            </button>
            <Bell size={19} className="text-zinc-500" />
            <div className="h-9 w-9 rounded-full bg-zinc-800" />
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-8 py-14">
          <p className="text-sm text-zinc-500">AI Communication Platform</p>

          <h2 className="mt-5 max-w-3xl text-6xl font-semibold leading-tight tracking-tight">
            What would you like OmniAI to do today?
          </h2>

          <div className="mt-10 rounded-3xl border border-white/10 bg-[#121214] p-4">
            <div className="min-h-36 rounded-2xl bg-[#0b0b0c] p-5 text-zinc-500">
              Ask OmniAI to import Excel orders, call customers, create a
              WhatsApp campaign, or build an automation workflow...
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "Import CSV",
                  "Call pending customers",
                  "Create WhatsApp campaign",
                  "Connect Google Sheets",
                ].map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                <Send size={18} />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-4">
            {[
              ["Calls today", "154"],
              ["Pending orders", "34"],
              ["Active agents", "4"],
              ["Success rate", "78%"],
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

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-medium">Quick import</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Upload Excel or CSV files and OmniAI will prepare confirmation
                calls automatically.
              </p>
              <button className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                <Upload size={16} />
                Upload CSV
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-medium">Recent activity</h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-400">
                <p>Ahmed confirmed his order.</p>
                <p>Sara did not answer.</p>
                <p>WhatsApp follow-up scheduled.</p>
                <p>New CSV file imported.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}