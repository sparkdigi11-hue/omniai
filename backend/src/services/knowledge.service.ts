import prisma from "../prisma/client";

export async function getKnowledgeItems() {
  return prisma.knowledgeItem.findMany({
    where: {
      workspaceId: "test-workspace",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createKnowledgeItem(data: {
  title: string;
  content: string;
  category: string;
}) {
  const workspace = await prisma.workspace.upsert({
    where: {
      id: "test-workspace",
    },
    update: {},
    create: {
      id: "test-workspace",
      name: "Test Workspace",
    },
  });

  return prisma.knowledgeItem.create({
    data: {
      workspaceId: workspace.id,
      title: data.title,
      content: data.content,
      category: data.category,
    },
  });
}
export async function updateKnowledgeItemById(
  itemId: string,
  data: {
    title?: string;
    content?: string;
    category?: string;
  }
) {
  return prisma.knowledgeItem.update({
    where: {
      id: itemId,
    },
    data,
  });
}