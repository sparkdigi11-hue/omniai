import { useState } from "react";
import {
  CheckCircle2,
  Mail,
  Save,
  Send,
  Settings2,
  UserRound,
} from "lucide-react";

export default function Email() {
  const [senderName, setSenderName] = useState("OmniAI");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState(
    "Order confirmation for {{product}}"
  );
  const [message, setMessage] = useState(
    "Hello {{customer_name}},\n\nWe are contacting you to confirm your order for {{product}}.\n\nTotal: {{price}}\n\nThank you."
  );
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [followUp, setFollowUp] = useState(true);
  const [saved, setSaved] = useState(false);

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
        Email Automation
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Send automatic order confirmations, follow-ups and customer updates.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <UserRound size={21} />
            </div>

            <div>
              <h3 className="font-medium">Sender information</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Configure the identity used to send emails.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Sender name</label>

              <input
                type="text"
                value={senderName}
                onChange={(event) => setSenderName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Sender email</label>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <Mail size={17} className="text-zinc-500" />

                <input
                  type="email"
                  value={senderEmail}
                  onChange={(event) => setSenderEmail(event.target.value)}
                  placeholder="support@yourstore.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Settings2 size={20} />

            <div>
              <h3 className="font-medium">Automation settings</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Choose which emails OmniAI sends automatically.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
              <div>
                <p className="font-medium">Order confirmation emails</p>

                <p className="mt-1 text-sm text-zinc-500">
                  Send an email when a new order is received.
                </p>
              </div>

              <input
                type="checkbox"
                checked={autoConfirm}
                onChange={(event) => setAutoConfirm(event.target.checked)}
                className="h-5 w-5"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 p-4">
              <div>
                <p className="font-medium">Automatic follow-up</p>

                <p className="mt-1 text-sm text-zinc-500">
                  Send another email when the customer does not respond.
                </p>
              </div>

              <input
                type="checkbox"
                checked={followUp}
                onChange={(event) => setFollowUp(event.target.checked)}
                className="h-5 w-5"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <Send size={20} />

          <div>
            <h3 className="font-medium">Email template</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Customize the automatic confirmation email.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-zinc-400">Subject</label>

          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm text-zinc-400">Message</label>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={8}
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm outline-none"
          />
        </div>

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