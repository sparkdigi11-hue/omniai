export default function AIEmployees() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-semibold">AI Employees</h2>

      <p className="mt-2 text-zinc-500">
        Create AI employees that answer customer calls automatically.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <button className="rounded-xl bg-white px-5 py-2 font-medium text-black">
          + Hire AI Employee
        </button>

        <p className="mt-4 text-sm text-zinc-500">
          No AI employees created yet.
        </p>
      </div>
    </div>
  );
}