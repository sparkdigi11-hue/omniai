import prisma from "../prisma/client";

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      customer: true,
      workspace: true,
    },
  });
}

export async function createOrder(data: {
  name: string;
  phone: string;
  city?: string;
  product: string;
  price?: string;
}) {
  const workspace = await prisma.workspace.upsert({
    where: { id: "test-workspace" },
    update: {},
    create: {
      id: "test-workspace",
      name: "Test Workspace",
    },
  });

  const customer = await prisma.customer.create({
    data: {
      workspaceId: workspace.id,
      name: data.name,
      phone: data.phone,
      city: data.city,
    },
  });

  return prisma.order.create({
    data: {
      workspaceId: workspace.id,
      customerId: customer.id,
      product: data.product,
      price: data.price,
    },
  });
}
export async function updateOrderStatusById(orderId: string, status: string) {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      customer: true,
      workspace: true,
    },
  });
}
export async function autoConfirmAllOrders() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  await Promise.all(
    orders.map((order, index) =>
      prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status:
            index % 4 === 0
              ? "Confirmed"
              : index % 4 === 1
              ? "No Answer"
              : index % 4 === 2
              ? "Callback"
              : "Confirmed",
        },
      })
    )
  );

  return prisma.order.findMany({
    include: {
      customer: true,
      workspace: true,
    },
  });
}