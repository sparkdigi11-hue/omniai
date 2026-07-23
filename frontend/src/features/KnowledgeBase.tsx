import { useEffect, useState } from "react";

type KnowledgeItem = {
  id: string;
  title: string;
  content: string;
  category: string;
};

export default function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
const [isEditing, setIsEditing] = useState(false);

const [editTitle, setEditTitle] = useState("");
const [editContent, setEditContent] = useState("");
const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    async function loadKnowledgeItems() {
      try {
        const response = await fetch(
          "http://localhost:4000/knowledge"
        );

        if (!response.ok) {
          throw new Error("Failed to load knowledge items");
        }

        const data: KnowledgeItem[] = await response.json();
        setItems(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadKnowledgeItems();
  }, []);
async function createKnowledgeItem() {
  if (!title.trim() || !category || !content.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/knowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        category,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create knowledge item");
    }

    const newItem: KnowledgeItem = await response.json();

    setItems((prev) => [newItem, ...prev]);
    setTitle("");
    setContent("");
    setCategory("");
    setShowCreateForm(false);
  } catch (error) {
    console.error(error);
    alert("Failed to create knowledge item.");
  }
}
async function saveKnowledgeItemChanges() {
  if (!selectedItem) return;

  if (!editTitle.trim() || !editCategory || !editContent.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:4000/knowledge/${selectedItem.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory,
          content: editContent.trim(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update knowledge item");
    }

    const updatedItem: KnowledgeItem = await response.json();

    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );

    setSelectedItem(updatedItem);
    setIsEditing(false);
  } catch (error) {
    console.error(error);
    alert("Failed to update knowledge item.");
  }
}
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            Knowledge Base
          </h1>

          <p className="mt-2 text-zinc-500">
            Manage products, FAQs, delivery rules, store
            policies, and AI knowledge.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateForm((previous) => !previous)
          }
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
        >
          {showCreateForm
            ? "Close Form"
            : "+ Add Knowledge Item"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-[#121214] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Add Knowledge Item
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Add information that your AI employees can use
                when talking to customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6">
            <label className="text-sm text-zinc-400">
              Title
            </label>

            <input
              type="text"
              placeholder="Example: Delivery Time"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm text-zinc-400">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
            >
              <option value="">Select category</option>
              <option value="Product">Product</option>
              <option value="FAQ">FAQ</option>
              <option value="Delivery">Delivery</option>
              <option value="Returns">Returns</option>
              <option value="Store Policy">
                Store Policy
              </option>
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm text-zinc-400">
              Knowledge Content
            </label>

            <textarea
              placeholder="Write the information the AI should know..."
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              className="mt-2 h-40 w-full resize-none rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <button
            type="button"
            onClick={createKnowledgeItem}
            className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
          >
            Add Knowledge Item
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-3 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-500">
            No knowledge items yet.
          </div>
        ) : (
          items.map((item) => (
            <button
  key={item.id}
  type="button"
  onClick={() => {
    setSelectedItem(item);
    setIsEditing(false);
  }}
  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:bg-white/[0.06]"
>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-400">
                {item.category}
              </span>

              <h3 className="mt-4 text-lg font-medium">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {item.content}
              </p>
</button>          ))
        )}
      </div>
      {selectedItem && (
  <div className="fixed right-0 top-0 z-50 h-screen w-[440px] overflow-y-auto border-l border-white/10 bg-[#121214] p-6 shadow-2xl">
    <div className="mb-6 flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          setSelectedItem(null);
          setIsEditing(false);
        }}
        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-zinc-300"
      >
        Close
      </button>

      <button
        type="button"
        onClick={() => {
          setEditTitle(selectedItem.title);
          setEditContent(selectedItem.content);
          setEditCategory(selectedItem.category);
          setIsEditing(true);
        }}
        className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black"
      >
        Edit Item
      </button>
    </div>

    <h2 className="text-2xl font-semibold">{selectedItem.title}</h2>

    <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-400">
      {selectedItem.category}
    </span>

    <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
      {selectedItem.content}
    </p>
    {isEditing && (
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <input
      type="text"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      placeholder="Title"
      className="w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
    />

    <select
      value={editCategory}
      onChange={(e) => setEditCategory(e.target.value)}
      className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
    >
      <option value="Product">Product</option>
      <option value="FAQ">FAQ</option>
      <option value="Delivery">Delivery</option>
      <option value="Returns">Returns</option>
      <option value="Store Policy">Store Policy</option>
    </select>

    <textarea
      value={editContent}
      onChange={(e) => setEditContent(e.target.value)}
      placeholder="Knowledge content"
      className="mt-3 h-40 w-full resize-none rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
    />

    <button
      type="button"
      onClick={saveKnowledgeItemChanges}
      className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
    >
      Save Changes
    </button>

    <button
      type="button"
      onClick={() => setIsEditing(false)}
      className="mt-2 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-400"
    >
      Cancel
    </button>
  </div>
)}
  </div>
)}
    </div>
  );
}