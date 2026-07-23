import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Plug,
  RefreshCw,
  Save,
  Webhook,
} from "lucide-react";

type WebhookEvent =
  | "order.created"
  | "order.updated"
  | "call.completed"
  | "customer.replied";

export default function API() {
  const [apiKey, setApiKey] = useState(
    "omni_live_7f3a9c2b8d4e6f1a"
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([
    "order.created",
    "call.completed",
  ]);

  const events: WebhookEvent[] = [
    "order.created",
    "order.updated",
    "call.completed",
    "customer.replied",
  ];

  const maskedApiKey = useMemo(() => {
    if (showApiKey) return apiKey;

    return `${apiKey.slice(0, 10)}${"•".repeat(14)}${apiKey.slice(-4)}`;
  }, [apiKey, showApiKey]);

  async function copyApiKey() {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  function regenerateApiKey() {
    const randomPart = crypto
      .getRandomValues(new Uint32Array(4))
      .join("")
      .slice(0, 18);

    setApiKey(`omni_live_${randomPart}`);
    setCopied(false);
  }

  function toggleEvent(eventName: WebhookEvent) {
    setSelectedEvents((previous) =>
      previous.includes(eventName)
        ? previous.filter((event) => event !== eventName)
        : [...previous, eventName]
    );
  }

  function saveSettings() {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div>
      <p className="text-sm text-zinc-500">Developer tools</p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        API & Webhooks
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Connect OmniAI with your store, CRM or external applications.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <KeyRound size={21} />
            </div>

            <div>
              <h3 className="font-medium">API key</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Use this key to authenticate requests to OmniAI.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-zinc-400">
              Secret API key
            </label>

            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <input
                type="text"
                readOnly
                value={maskedApiKey}
                className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowApiKey((previous) => !previous)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                title={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>

              <button
                type="button"
                onClick={copyApiKey}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                title="Copy API key"
              >
                {copied ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-600">
              Never expose this key inside public frontend code.
            </p>
          </div>

          <button
            type="button"
            onClick={regenerateApiKey}
            className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
          >
            <RefreshCw size={16} />
            Regenerate key
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Plug size={21} />
            </div>

            <div>
              <h3 className="font-medium">API endpoint</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Send orders and customer data directly to OmniAI.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Base URL
            </p>

            <code className="mt-2 block break-all text-sm text-zinc-200">
              http://localhost:4000/api
            </code>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Create order
            </p>

            <code className="mt-2 block text-sm text-zinc-200">
              POST /orders
            </code>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Start calls
            </p>

            <code className="mt-2 block text-sm text-zinc-200">
              POST /calls/start
            </code>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Webhook size={20} />

          <div>
            <h3 className="font-medium">Webhook configuration</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Receive real-time updates when events happen in OmniAI.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-zinc-400">Webhook URL</label>

          <input
            type="url"
            value={webhookUrl}
            onChange={(event) => setWebhookUrl(event.target.value)}
            placeholder="https://your-app.com/webhooks/omniai"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm text-zinc-400">Events</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {events.map((eventName) => (
              <label
                key={eventName}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4"
              >
                <div>
                  <p className="font-mono text-sm text-zinc-200">
                    {eventName}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Send an update when this event occurs.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={selectedEvents.includes(eventName)}
                  onChange={() => toggleEvent(eventName)}
                  className="h-5 w-5"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? "Saved" : "Save configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}