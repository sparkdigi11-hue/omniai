import prisma from "../prisma/client";

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      customer: true,
      workspace: true,
    },
  });
}