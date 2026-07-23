import { useState } from "react";
import {
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Receipt,
  Save,
  Sparkles,
  Zap,
} from "lucide-react";

type PlanName = "Starter" | "Growth" | "Scale";

type Plan = {
  name: PlanName;
  price: string;
  description: string;
  icon: typeof Zap;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$19",
    description: "For small stores starting with AI automation.",
    icon: Zap,
    features: [
      "500 AI calls per month",
      "1 AI employee",
      "WhatsApp automation",
      "Email automation",
      "Basic analytics",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    description: "For growing teams with more orders and channels.",
    icon: Sparkles,
    features: [
      "2,500 AI calls per month",
      "5 AI employees",
      "WhatsApp and Instagram",
      "Advanced workflows",
      "API and webhooks",
    ],
  },
  {
    name: "Scale",
    price: "$99",
    description: "For high-volume stores and larger teams.",
    icon: Crown,
    features: [
      "10,000 AI calls per month",
      "Unlimited AI employees",
      "Priority support",
      "Team permissions",
      "Advanced reporting",
    ],
  },
];

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState<PlanName>("Growth");
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Yearly">(
    "Monthly"
  );
  const [saved, setSaved] = useState(false);

  function selectPlan(planName: PlanName) {
    setCurrentPlan(planName);
  }

  function saveBilling() {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div>
      <p className="text-sm text-zinc-500">Workspace</p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Billing & Plans
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
        Manage your subscription, usage and payment preferences.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <CreditCard size={20} />

            <div>
              <p className="text-sm text-zinc-500">Current plan</p>
              <p className="mt-1 text-xl font-semibold">{currentPlan}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Zap size={20} />

            <div>
              <p className="text-sm text-zinc-500">Calls used</p>
              <p className="mt-1 text-xl font-semibold">1,284 / 2,500</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Receipt size={20} />

            <div>
              <p className="text-sm text-zinc-500">Next invoice</p>
              <p className="mt-1 text-xl font-semibold">$49.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div>
          <p className="font-medium">Billing cycle</p>

          <p className="mt-1 text-sm text-zinc-500">
            Choose monthly or yearly billing.
          </p>
        </div>

        <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
          {(["Monthly", "Yearly"] as const).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className={`rounded-lg px-4 py-2 text-sm ${
                billingCycle === cycle
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          const isCurrent = currentPlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`rounded-3xl border p-6 ${
                isCurrent
                  ? "border-white/30 bg-white/[0.07]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-white/5 p-3">
                  <PlanIcon size={21} />
                </div>

                {isCurrent && (
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                    Current plan
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-xl font-semibold">{plan.name}</h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {plan.description}
              </p>

              <div className="mt-5">
                <span className="text-3xl font-semibold">{plan.price}</span>
                <span className="ml-1 text-sm text-zinc-500">
                  /{billingCycle === "Monthly" ? "month" : "year"}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <Check size={16} className="shrink-0 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => selectPlan(plan.name)}
                className={`mt-7 w-full rounded-xl px-4 py-2.5 text-sm font-medium ${
                  isCurrent
                    ? "border border-white/10 text-zinc-400"
                    : "bg-white text-black"
                }`}
              >
                {isCurrent ? "Current plan" : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-medium">Payment method</h3>

        <p className="mt-1 text-sm text-zinc-500">
          Your subscription will renew automatically using this card.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <CreditCard size={19} />
            </div>

            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="mt-1 text-sm text-zinc-500">Expires 12/29</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Update card
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={saveBilling}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved" : "Save billing"}
        </button>
      </div>
    </div>
  );
}