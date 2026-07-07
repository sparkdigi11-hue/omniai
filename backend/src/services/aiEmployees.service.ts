import prisma from "../prisma/client";

export async function getAIEmployees() {
  return prisma.aIEmployee.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createAIEmployee(data: {
  name: string;
  role: string;
  language: string;
}) {
  const workspace = await prisma.workspace.upsert({
    where: { id: "test-workspace" },
    update: {},
    create: {
      id: "test-workspace",
      name: "Test Workspace",
    },
  });

  return prisma.aIEmployee.create({
    data: {
      workspaceId: workspace.id,
      name: data.name,
      role: data.role,
      language: data.language,
    },
  });
}