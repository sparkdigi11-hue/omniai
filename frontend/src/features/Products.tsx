import { useEffect, useMemo, useState } from "react";
import { Package, Pencil, Plus, Search, Trash2, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  sku: string;
  deliveryTime: string;
  aiInstructions: string;
  status: "Active" | "Inactive";
};

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
  sku: "",
  deliveryTime: "",
  aiInstructions: "",
  status: "Active" as "Active" | "Inactive",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
  loadProducts();
}, []);

async function loadProducts() {
  try {
    const response = await fetch("http://localhost:4000/products");

    const data = await response.json();

    setProducts(data);
  } catch (error) {
    console.error(error);
  }
}

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  function openAddProduct() {
    setEditingProductId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingProductId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      sku: product.sku,
      deliveryTime: product.deliveryTime,
      aiInstructions: product.aiInstructions,
      status: product.status,
    });

    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingProductId(null);
    setForm(emptyForm);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      return;
    }

   if (editingProductId) {
  const response = await fetch(
    `http://localhost:4000/products/${editingProductId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  const updatedProduct = await response.json();

  setProducts((currentProducts) =>
    currentProducts.map((product) =>
      product.id === editingProductId ? updatedProduct : product
    )
  );
} else {
  const response = await fetch("http://localhost:4000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const newProduct = await response.json();

  setProducts((currentProducts) => [
    newProduct,
    ...currentProducts,
  ]);
}

closeForm();
  
} // ← هادي كانت ناقصة
 async function deleteProduct(productId: string) {
  await fetch(`http://localhost:4000/products/${productId}`, {
    method: "DELETE",
  });

  setProducts((currentProducts) =>
    currentProducts.filter((product) => product.id !== productId)
  );
}

  return (
    <>
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Product management</p>

            <h1 className="mt-2 text-3xl font-semibold">Products</h1>

            <p className="mt-2 text-sm text-zinc-500">
              Add your products and the information OmniAI needs when speaking
              with customers.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddProduct}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
            <Search size={16} className="text-zinc-500" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </div>

          <p className="text-sm text-zinc-500">
            {filteredProducts.length} products
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
                <Package size={22} className="text-zinc-400" />
              </div>

              <h2 className="mt-4 text-lg font-medium">No products yet</h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Add your first product so OmniAI can answer customer questions
                about prices, stock, delivery, and product details.
              </p>

              <button
                type="button"
                onClick={openAddProduct}
                className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
              >
                <Plus size={17} />
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr className="text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Stock</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">{product.name}</p>

                        <p className="mt-1 text-xs text-zinc-500">
                          SKU: {product.sku || "Not added"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-300">
                        {product.category || "Uncategorized"}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-300">
                        {product.price}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-300">
                        {product.stock || "0"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            product.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-zinc-500/10 text-zinc-400"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProduct(product)}
                            className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <button
            type="button"
            onClick={closeForm}
            className="absolute inset-0"
            aria-label="Close product form"
          />

          <div className="relative h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#111113] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">
                  {editingProductId ? "Edit product" : "New product"}
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {editingProductId ? "Update Product" : "Add Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="mt-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-400">Product name *</span>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="Classic T-shirt"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-zinc-400">Price *</span>

                  <input
                    type="text"
                    value={form.price}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        price: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="199 MAD"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-400">Category</span>

                  <input
                    type="text"
                    value={form.category}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        category: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="Clothing"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-zinc-400">SKU</span>

                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        sku: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="TSHIRT-001"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-zinc-400">Stock</span>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        stock: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-zinc-400">
                    Delivery time
                  </span>

                  <input
                    type="text"
                    value={form.deliveryTime}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        deliveryTime: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                    placeholder="24–48 hours"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-400">Description</span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                  placeholder="Describe the product..."
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-400">
                  AI instructions
                </span>

                <textarea
                  value={form.aiInstructions}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      aiInstructions: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/20"
                  placeholder="Example: Never offer a discount above 10%."
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-400">Status</span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      status: event.target.value as "Active" | "Inactive",
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#171719] px-4 py-3 text-sm outline-none focus:border-white/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  {editingProductId ? "Save Changes" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}