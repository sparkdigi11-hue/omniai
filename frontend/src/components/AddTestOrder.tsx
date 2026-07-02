export default function AddTestOrder() {
  async function addOrder() {
    await fetch("http://localhost:4000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Yassine",
        phone: "0600000000",
        city: "Casablanca",
        product: "Nike Air Max",
        price: "699",
      }),
    });

    window.location.reload();
  }

  return (
    <button
      onClick={addOrder}
      className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
    >
      + Add Test Order
    </button>
  );
}