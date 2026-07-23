import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Save,
  Workflow,
} from "lucide-react";

type WorkflowItem = {
  id: number;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
};

export default function Workflows() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    {
      id: 1,
      name: "Confirm new orders",
      trigger: "New order received",
      action: "Start AI confirmation call",
      enabled: true,
    },
    {
      id: 2,
      name: "No answer follow-up",
      trigger: "Customer does not answer",
      action: "Send WhatsApp message",
      enabled: true,
    },
    {
      id: 3,
      name: "Callback reminder",
      trigger: "Callback requested",
      action: "Create callback task",
      enabled: true,
    },
  ]);

  const [workflowName, setWorkflowName] = useState("");
  const [trigger, setTrigger] = useState("New order received");
  const [action, setAction] = useState("Start AI confirmation call");
  const [saved, setSaved] = useState(false);

  function addWorkflow() {
    if (!workflowName.trim()) return;

    setWorkflows((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: workflowName.trim(),
        trigger,
        action,
        enabled: true,
      },
    ]);

    setWorkflowName("");
  }

  function toggleWorkflow(id: number) {
    setWorkflows((previous) =>
      previous.map((workflow) =>
        workflow.id === id
          ? { ...workflow, enabled: !workflow.enabled }
          : workflow
      )
    );
  }

  function saveWorkflows() {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  function getActionIcon(actionName: string) {
    const lowerAction = actionName.toLowerCase();

    if (lowerAction.includes("call")) return Phone;
    if (lowerAction.includes("whatsapp")) return MessageCircle;
    if (lowerAction.includes("email")) return Mail;

    return Clock3;
  }

  return (
    <div>
      <p className="text-sm text-zinc-500">Automation</p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Workflows
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Create automatic actions for orders, calls and customer follow-ups.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Workflow size={20} />

            <div>
              <h3 className="font-medium">Active workflows</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Manage the automations running across your workspace.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {workflows.map((workflow) => {
              const ActionIcon = getActionIcon(workflow.action);

              return (
                <div
                  key={workflow.id}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-xl bg-white/5 p-2.5 text-zinc-300">
                        <ActionIcon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium">{workflow.name}</p>

                        <p className="mt-2 text-sm text-zinc-500">
                          When: {workflow.trigger}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          Then: {workflow.action}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={workflow.enabled}
                      onChange={() => toggleWorkflow(workflow.id)}
                      className="h-5 w-5 shrink-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Plus size={20} />

            <div>
              <h3 className="font-medium">Create workflow</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Add a new automation rule.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-zinc-400">
                Workflow name
              </label>

              <input
                type="text"
                value={workflowName}
                onChange={(event) => setWorkflowName(event.target.value)}
                placeholder="Example: Send delivery update"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Trigger</label>

              <select
                value={trigger}
                onChange={(event) => setTrigger(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#121214] px-4 py-3 text-sm outline-none"
              >
                <option>New order received</option>
                <option>Call confirmed</option>
                <option>Customer does not answer</option>
                <option>Callback requested</option>
                <option>Order cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Action</label>

              <select
                value={action}
                onChange={(event) => setAction(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#121214] px-4 py-3 text-sm outline-none"
              >
                <option>Start AI confirmation call</option>
                <option>Send WhatsApp message</option>
                <option>Send email</option>
                <option>Create callback task</option>
                <option>Update order status</option>
              </select>
            </div>

            <button
              type="button"
              onClick={addWorkflow}
              disabled={!workflowName.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={16} />
              Add workflow
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={saveWorkflows}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved" : "Save workflows"}
        </button>
      </div>
    </div>
  );
}