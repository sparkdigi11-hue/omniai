import { useState } from "react";
import {
  CheckCircle2,
  Link2,
  MessageCircle,
  Phone,
  Save,
  Send,
  Settings2,
} from "lucide-react";

export default function WhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connected, setConnected] = useState(false);
  const [autoReply, setAutoReply] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [message, setMessage] = useState(
    "Hello {{customer_name}}, we are contacting you to confirm your order for {{product}}."
  );
  const [saved, setSaved] = useState(false);

  function connectWhatsApp() {
    if (!phoneNumber.trim()) return;

    setConnected(true);
  }

  function saveSettings() {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div>
      <div>
        <p className="text-sm text-zinc-500">Communication Channel</p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          WhatsApp Automation
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Connect WhatsApp to confirm orders, answer customer questions and
          send automatic follow-up messages.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
              <MessageCircle size={21} />
            </div>

            <div>
              <h3 className="font-medium">WhatsApp Business</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Connect your business phone number.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-zinc-400">
              WhatsApp phone number
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <Phone size={17} className="text-zinc-500" />

              <input
                type="text"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+212 6 00 00 00 00"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={connectWhatsApp}
            disabled={!phoneNumber.trim()}
            className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Link2 size={16} />
            {connected ? "Connected" : "Connect WhatsApp"}
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-500">Connection status</p>

          <div className="mt-5 flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                connected ? "bg-emerald-400" : "bg-zinc-600"
              }`}
            />

            <p className="font-medium">
              {connected ? "WhatsApp connected" : "Not connected"}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {connected
              ? `OmniAI is connected to ${phoneNumber}.`
              : "Enter your phone number to activate WhatsApp automation."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Settings2 size={20} />

          <div>
            <h3 className="font-medium">Automation settings</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Choose what OmniAI can do automatically.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
            <div>
              <p className="font-medium">Automatic replies</p>

              <p className="mt-1 text-sm text-zinc-500">
                AI answers customer questions automatically.
              </p>
            </div>

            <input
              type="checkbox"
              checked={autoReply}
              onChange={(event) => setAutoReply(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
            <div>
              <p className="font-medium">Order confirmation</p>

              <p className="mt-1 text-sm text-zinc-500">
                AI confirms customer orders through WhatsApp.
              </p>
            </div>

            <input
              type="checkbox"
              checked={autoConfirm}
              onChange={(event) => setAutoConfirm(event.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Send size={20} />

          <div>
            <h3 className="font-medium">Confirmation message</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Message sent automatically when a new order is received.
            </p>
          </div>
        </div>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm outline-none"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            Variables: {"{{customer_name}}"}, {"{{product}}"}, {"{{price}}"}
          </p>

          <button
            type="button"
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
          >
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? "Saved" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}