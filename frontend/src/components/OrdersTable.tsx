type Order = {
  id: string;
  name: string;
  phone: string;
  product: string;
  city: string;
  price: string;
  status: string;
};

type Props = {
  orders: Order[];
};

export default function OrdersTable({ orders }: Props) {
  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Orders Queue</h3>

        <p className="text-sm text-zinc-500">
          {orders.length} Orders
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-zinc-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Product</th>
              <th className="p-3">City</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-white/10"
              >
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">{order.product}</td>
                <td className="p-3">{order.city}</td>
                <td className="p-3">{order.price}</td>
                <td className="p-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}