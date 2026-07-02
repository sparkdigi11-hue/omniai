export default function Orders() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-semibold">
            Orders
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Import and manage customer orders.
          </p>
        </div>

        <button className="rounded-xl bg-white px-5 py-2 text-black font-medium">
          Import Orders
        </button>

      </div>

    </div>
  );
}