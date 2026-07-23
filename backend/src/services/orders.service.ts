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
    callStatus: "Pending",
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
export async function updateOrderById(
  orderId: string,
  data: {
    name?: string;
    phone?: string;
    city?: string;
    product?: string;
    price?: string | number;
  }
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      customer: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.$transaction(async (transaction) => {
    if (
      data.name !== undefined ||
      data.phone !== undefined ||
      data.city !== undefined
    ) {
      await transaction.customer.update({
        where: {
          id: order.customerId,
        },
        data: {
          name: data.name,
          phone: data.phone,
          city: data.city,
        },
      });
    }

    return transaction.order.update({
      where: {
        id: orderId,
      },
      data: {
        product: data.product,
        price:
          data.price !== undefined
            ? String(data.price)
            : undefined,
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
  });
}

export async function deleteOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.order.delete({
    where: {
      id: orderId,
    },
  });

  return {
    success: true,
    message: "Order deleted successfully",
  };
}

export async function startOrderCallById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      customer: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const existingPendingCall = await prisma.call.findFirst({
    where: {
      orderId,
      status: {
        in: ["Pending", "In Progress"],
      },
    },
  });

  if (existingPendingCall) {
    throw new Error(
      "This order already has a pending or active call"
    );
  }

  return prisma.$transaction(async (transaction) => {
    const call = await transaction.call.create({
      data: {
        workspaceId: order.workspaceId,
        orderId: order.id,
        customer: order.customer.name,
        phone: order.customer.phone,
        product: order.product,
        aiEmployee: "Default AI",
        status: "Pending",
      },
    });

    await transaction.order.update({
      where: {
        id: order.id,
      },
      data: {
        callStatus: "In Progress",
        events: {
          create: {
            type: "CALL",
            title: "AI call started",
            description: "The order was sent to the AI calling queue.",
          },
        },
      },
    });

    return call;
  });
}