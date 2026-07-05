import prisma from "../prisma/client";

export async function getOrders() {
  return prisma.order.findMany({
    include: {
  customer: true,
  workspace: true,
  events: {
    orderBy: {
      createdAt: "desc",
    },
  },
},
    orderBy: {
      createdAt: "desc",
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
    include: {
      customer: true,
      workspace: true,
      events: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function updateOrderStatusById(orderId: string, status: string) {
  const currentOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!currentOrder) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
      events: {
        create: {
          type: "STATUS",
          title: "Status changed",
          description: `${currentOrder.status} → ${status}`,
        },
      },
    },
    include: {
      customer: true,
      workspace: true,
      events: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function updateOrderManagementById(
  orderId: string,
  data: {
    notes?: string;
    aiSummary?: string;
    callbackAt?: string | null;
  }
) {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      notes: data.notes,
      aiSummary: data.aiSummary,
      callbackAt: data.callbackAt ? new Date(data.callbackAt) : null,
    },
    include: {
  customer: true,
  workspace: true,
  events: {
    orderBy: {
      createdAt: "desc",
    },
  },
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
      events: {
  orderBy: {
    createdAt: "desc",
  },
},
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}