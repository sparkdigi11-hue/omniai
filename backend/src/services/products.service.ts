import prisma from "../prisma/client";

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProduct(data: {
  name: string;
  price: string;
  stock: string;
  category: string;
  description: string;
  sku: string;
  deliveryTime: string;
  aiInstructions: string;
  status?: string;
}) {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      category: data.category,
      description: data.description,
      sku: data.sku,
      deliveryTime: data.deliveryTime,
      aiInstructions: data.aiInstructions,
      status: data.status ?? "Active",
    },
  });
}

export async function updateProductById(
  id: string,
  data: Partial<{
    name: string;
    price: string;
    stock: string;
    category: string;
    description: string;
    sku: string;
    deliveryTime: string;
    aiInstructions: string;
    status: string;
  }>
) {
  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteProductById(id: string) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}