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
  goal?: string;
  script?: string;
  tools?: string;
  knowledgeItemIds?: string;
rules?: string;}) {
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
  goal: data.goal,
  script: data.script,
  tools: data.tools,
  rules: data.rules,
  knowledgeItemIds: data.knowledgeItemIds,
},
  });
}
export async function updateAIEmployeeById(
  employeeId: string,
  data: {
    name?: string;
    role?: string;
    language?: string;
    goal?: string;
    script?: string;
    rules?: string;
    tools?: string;
    knowledgeItemIds?: string;
  }
) {
  return prisma.aIEmployee.update({
    where: {
      id: employeeId,
    },
    data,
  });
}
export async function deleteAIEmployeeById(
  employeeId: string
) {
  return prisma.aIEmployee.delete({
    where: {
      id: employeeId,
    },
  });
}