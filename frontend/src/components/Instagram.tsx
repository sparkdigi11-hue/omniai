import { useState } from "react";
import {
  CheckCircle2,
  Camera,
  Link2,
  MessageCircle,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";

export default function Instagram() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [autoReply, setAutoReply] = useState(true);
  const [leadCapture, setLeadCapture] = useState(true);
  const [saved, setSaved] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello {{customer_name}} 👋 How can we help you today?"
  );

  function connectInstagram() {
    if (!username.trim()) return;

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
      <p className="text-sm text-zinc-500">Communication Channel</p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Instagram Automation
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Connect Instagram to answer direct messages, capture leads and manage
        customer conversations automatically.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
             <Camera size={21} />
            </div>

            <div>
              <h3 className="font-medium">Instagram Business</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Connect your Instagram business account.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-zinc-400">
              Instagram username
            </label>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-zinc-500">@</span>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="yourbusiness"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={connectInstagram}
            disabled={!username.trim()}
            className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Link2 size={16} />
            {connected ? "Connected" : "Connect Instagram"}
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
              {connected ? "Instagram connected" : "Not connected"}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {connected
              ? `OmniAI is connected to @${username}.`
              : "Enter your username to activate Instagram automation."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Settings2 size={20} />

          <div>
            <h3 className="font-medium">Automation settings</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Choose what OmniAI can manage automatically.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="mt-1 text-zinc-400" />

              <div>
                <p className="font-medium">Automatic DM replies</p>

                <p className="mt-1 text-sm text-zinc-500">
                  AI answers incoming Instagram messages automatically.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={autoReply}
              onChange={(event) => setAutoReply(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="mt-1 text-zinc-400" />

              <div>
                <p className="font-medium">Lead capture</p>

                <p className="mt-1 text-sm text-zinc-500">
                  AI collects customer name, phone number and product interest.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={leadCapture}
              onChange={(event) => setLeadCapture(event.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div>
          <h3 className="font-medium">Welcome message</h3>

          <p className="mt-1 text-sm text-zinc-500">
            First message sent when a customer contacts your Instagram account.
          </p>
        </div>

        <textarea
          value={welcomeMessage}
          onChange={(event) => setWelcomeMessage(event.target.value)}
          rows={5}
          className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm outline-none"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            Variables: {"{{customer_name}}"}, {"{{product}}"}
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