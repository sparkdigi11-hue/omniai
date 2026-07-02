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