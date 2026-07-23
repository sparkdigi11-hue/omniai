import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "No Answer"
  | "Callback"
  | "Cancelled"
  | "In Progress"
  | string;

type Order = {
  id: string;
  product: string;
  city?: string | null;
  price?: number | string | null;
  status?: OrderStatus | null;
  callStatus?: OrderStatus | null;
  createdAt?: string | null;

  customer?: {
    id?: string;
    name?: string | null;
    phone?: string | null;
    city?: string | null;
  } | null;

  name?: string | null;
  phone?: string | null;
};

type ImportedOrder = {
  name: string;
  phone: string;
  product: string;
  city: string;
  price: number;
};

type EditOrderForm = {
  name: string;
  phone: string;
  product: string;
  city: string;
  price: string;
};

const API_URL = "http://localhost:4000";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/15 text-yellow-400",
  Confirmed: "bg-green-500/15 text-green-400",
  "No Answer": "bg-red-500/15 text-red-400",
  Callback: "bg-blue-500/15 text-blue-400",
  Cancelled: "bg-zinc-500/15 text-zinc-400",
  "In Progress": "bg-purple-500/15 text-purple-400",
};

function getCustomerName(order: Order) {
  return order.customer?.name || order.name || "Unknown customer";
}

function getCustomerPhone(order: Order) {
  return order.customer?.phone || order.phone || "No phone";
}

function getOrderCity(order: Order) {
  return order.city || order.customer?.city || "Unknown";
}

function getOrderStatus(order: Order) {
  return order.callStatus || order.status || "Pending";
}

function getNumericPrice(price: Order["price"]) {
  if (typeof price === "number") {
    return price;
  }

  if (typeof price === "string") {
    const normalizedPrice = price.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsedPrice = Number(normalizedPrice);

    return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
  }

  return 0;
}

function formatPrice(price: Order["price"]) {
  return `${getNumericPrice(price).toFixed(2)} DH`;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "Unknown date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Orders() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState<EditOrderForm>({
    name: "",
    phone: "",
    product: "",
    city: "",
    price: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");

  const ordersPerPage = 8;

  async function loadOrders() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/orders`);

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (loadError) {
      console.error(loadError);
      setError("Could not load orders from the backend.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => getOrderStatus(order) === "Pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => getOrderStatus(order) === "Confirmed"
  ).length;

  const confirmedRevenue = orders
    .filter((order) => getOrderStatus(order) === "Confirmed")
    .reduce((total, order) => total + getNumericPrice(order.price), 0);

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        orders
          .map((order) => getOrderCity(order))
          .filter((city) => city && city !== "Unknown")
      )
    ).sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = getCustomerName(order).toLowerCase();
      const customerPhone = getCustomerPhone(order).toLowerCase();
      const product = (order.product || "").toLowerCase();
      const city = getOrderCity(order);
      const status = getOrderStatus(order);

      const matchesSearch =
        !normalizedSearch ||
        customerName.includes(normalizedSearch) ||
        customerPhone.includes(normalizedSearch) ||
        product.includes(normalizedSearch) ||
        city.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesCity =
        cityFilter === "All" || city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [orders, search, statusFilter, cityFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, cityFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setCityFilter("All");
    setCurrentPage(1);
  }

  function openImportPicker() {
    fileInputRef.current?.click();
  }

  function handleImportFile(file: File) {
    setIsImporting(true);
    setError("");

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (result) => {
        try {
          const importedOrders: ImportedOrder[] = result.data
            .map((row) => {
              const name =
                row.name ||
                row.Name ||
                row.customer ||
                row.Customer ||
                row.customerName ||
                "";

              const phone =
                row.phone ||
                row.Phone ||
                row.telephone ||
                row.Telephone ||
                row.mobile ||
                "";

              const product =
                row.product ||
                row.Product ||
                row.item ||
                row.Item ||
                "";

              const city =
                row.city ||
                row.City ||
                row.ville ||
                row.Ville ||
                "";

              const rawPrice =
                row.price ||
                row.Price ||
                row.amount ||
                row.Amount ||
                "0";

              return {
                name: String(name).trim(),
                phone: String(phone).trim(),
                product: String(product).trim(),
                city: String(city).trim(),
                price: getNumericPrice(rawPrice),
              };
            })
            .filter(
              (order) =>
                order.name && order.phone && order.product
            );

          if (importedOrders.length === 0) {
            throw new Error(
              "No valid orders found. Required columns: name, phone, product, city and price."
            );
          }

          const response = await fetch(`${API_URL}/orders/import`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orders: importedOrders,
            }),
          });

          if (!response.ok) {
            const responseText = await response.text();

            throw new Error(
              responseText || "Failed to import orders"
            );
          }

          await loadOrders();

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (importError) {
          console.error(importError);

          setError(
            importError instanceof Error
              ? importError.message
              : "Failed to import orders."
          );
        } finally {
          setIsImporting(false);
        }
      },

      error: (parseError) => {
        console.error(parseError);
        setError("Failed to read the selected file.");
        setIsImporting(false);
      },
    });
  }
async function deleteOrder(orderId: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmed) return;

  setError("");

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(message || "Failed to delete order");
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== orderId)
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  } catch (deleteError) {
    console.error(deleteError);

    setError(
      deleteError instanceof Error
        ? deleteError.message
        : "Failed to delete order."
    );
  }
}

async function startOrderCall(orderId: string) {
  setError("");

  try {
    const response = await fetch(
      `${API_URL}/orders/${orderId}/start-call`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to start AI call");
    }

    await loadOrders();
    window.alert("AI call started successfully.");
  } catch (callError) {
    console.error(callError);

    setError(
      callError instanceof Error
        ? callError.message
        : "Failed to start AI call."
    );
  }
}


function openEditModal(order: Order) {
  setEditingOrder(order);
  setEditForm({
    name: getCustomerName(order) === "Unknown customer" ? "" : getCustomerName(order),
    phone: getCustomerPhone(order) === "No phone" ? "" : getCustomerPhone(order),
    product: order.product || "",
    city: getOrderCity(order) === "Unknown" ? "" : getOrderCity(order),
    price: String(getNumericPrice(order.price)),
  });
  setError("");
}

function closeEditModal() {
  if (isSavingEdit) return;
  setEditingOrder(null);
}

async function saveEditedOrder(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!editingOrder) return;

  if (
    !editForm.name.trim() ||
    !editForm.phone.trim() ||
    !editForm.product.trim()
  ) {
    setError("Name, phone and product are required.");
    return;
  }

  setIsSavingEdit(true);
  setError("");

  try {
    const response = await fetch(`${API_URL}/orders/${editingOrder.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        product: editForm.product.trim(),
        city: editForm.city.trim(),
        price: editForm.price.trim() || "0",
      }),
    });

    const responseText = await response.text();
    let updatedOrder: Order | null = null;

    if (responseText) {
      try {
        updatedOrder = JSON.parse(responseText) as Order;
      } catch {
        if (!response.ok) {
          throw new Error(responseText);
        }
      }
    }

    if (!response.ok) {
      throw new Error(
        (updatedOrder as { message?: string } | null)?.message ||
          "Failed to update order"
      );
    }

    if (updatedOrder) {
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder?.id ? updatedOrder : order
        )
      );

      if (selectedOrder?.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
    } else {
      await loadOrders();
    }

    setEditingOrder(null);
  } catch (editError) {
    console.error(editError);
    setError(
      editError instanceof Error
        ? editError.message
        : "Failed to update order."
    );
  } finally {
    setIsSavingEdit(false);
  }
}

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Orders
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Import, search and manage customer orders.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadOrders}
            disabled={isLoading}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={openImportPicker}
            disabled={isImporting}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting ? "Importing..." : "Import Orders"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                handleImportFile(file);
              }
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Orders", totalOrders],
          ["Pending", pendingOrders],
          ["Confirmed", confirmedOrders],
          ["Confirmed Revenue", `${confirmedRevenue.toFixed(2)} DH`],
        ].map(([title, value]) => (
          <div
            key={String(title)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-zinc-500">
              {title}
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, phone, product or city..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/20"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#18181b] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Confirmed">Confirmed</option>
            <option value="No Answer">No Answer</option>
            <option value="Callback">Callback</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={cityFilter}
            onChange={(event) =>
              setCityFilter(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#18181b] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="All">All cities</option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-lg font-medium">
              All Orders
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {filteredOrders.length} order
              {filteredOrders.length === 1 ? "" : "s"} found.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            Loading orders...
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-base font-medium text-zinc-300">
              No orders found
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Import a CSV file or change your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-medium">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Product
                  </th>

                  <th className="px-6 py-4 font-medium">
                    City
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Price
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.map((order) => {
                  const status = getOrderStatus(order);

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 transition last:border-b-0 hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-zinc-200">
                          {getCustomerName(order)}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {getCustomerPhone(order)}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {order.product || "No product"}
                      </td>

                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {getOrderCity(order)}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-zinc-300">
                        {formatPrice(order.price)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            statusStyles[status] ||
                            "bg-white/10 text-zinc-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-4">
  <div className="flex items-center justify-end gap-2">
    <button
      type="button"
      onClick={() => setSelectedOrder(order)}
      title="View order details"
      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/5"
    >
      View
    </button>

    <button
      type="button"
      onClick={() => startOrderCall(order.id)}
      title="Start AI call"
      className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-400 transition hover:bg-purple-500/20"
    >
      Call
    </button>

    <button
      type="button"
      onClick={() => openEditModal(order)}
      title="Edit order"
      className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20"
    >
      Edit
    </button>

        <button
  type="button"
  onClick={() => deleteOrder(order.id)}
  title="Delete order"
  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
>
  Delete
</button>
  </div>
</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredOrders.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {editingOrder && (
        <>
          <button
            type="button"
            aria-label="Close edit order modal"
            onClick={closeEditModal}
            className="fixed inset-0 z-[60] cursor-default bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <form
              onSubmit={saveEditedOrder}
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#121214] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Edit Order</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    Update customer and order information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSavingEdit}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-zinc-400">
                    Customer name
                  </span>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/25"
                    placeholder="Customer name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-zinc-400">
                    Phone
                  </span>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/25"
                    placeholder="Phone number"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-zinc-400">
                    Product
                  </span>
                  <input
                    type="text"
                    value={editForm.product}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        product: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/25"
                    placeholder="Product"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-zinc-400">
                    City
                  </span>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/25"
                    placeholder="City"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm text-zinc-400">
                    Price
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-14 text-sm outline-none transition focus:border-white/25"
                      placeholder="0.00"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                      DH
                    </span>
                  </div>
                </label>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSavingEdit}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {selectedOrder && (
        <>
          <button
            type="button"
            aria-label="Close order details"
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto border-l border-white/10 bg-[#121214] p-6 shadow-2xl sm:w-[460px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Customer and order information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Customer
              </p>

              <p className="mt-3 text-lg font-medium">
                {getCustomerName(selectedOrder)}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {getCustomerPhone(selectedOrder)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">
                  City
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  {getOrderCity(selectedOrder)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">
                  Price
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-300">
                  {formatPrice(selectedOrder.price)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Product
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                {selectedOrder.product || "No product information"}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Status
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  statusStyles[getOrderStatus(selectedOrder)] ||
                  "bg-white/10 text-zinc-400"
                }`}
              >
                {getOrderStatus(selectedOrder)}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Created
              </p>

              <p className="mt-3 text-sm text-zinc-300">
                {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}