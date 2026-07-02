export default function KnowledgeBase() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-lg font-medium">AI Knowledge</h3>

      <p className="mt-2 text-sm text-zinc-500">
        Add store information, products, FAQ, rules, and files so your AI can
        answer customers during calls.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          "Store information",
          "Products",
          "FAQ",
          "Delivery rules",
          "AI behaviour",
          "Forbidden answers",
        ].map((item) => (
          <button
            key={item}
            className="rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}