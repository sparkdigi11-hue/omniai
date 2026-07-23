import prisma from "../prisma/client";

export async function getAllCalls() {
  return prisma.call.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createNewCall(data: any) {
  return prisma.call.create({
    data,
  });
}

export async function startPendingOrderCalls() {
  const orders = await prisma.order.findMany({
    where: {
      callStatus: "Pending",
    },
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log("Pending Orders:", orders.length);

  const createdCalls = [];

  for (const order of orders) {
    const call = await prisma.call.create({
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

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        callStatus: "In Progress",
      },
    });

    createdCalls.push(call);
  }

  return createdCalls;
}

export async function updateExistingCall(id: string, data: any) {
  return prisma.call.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteExistingCall(id: string) {
  return prisma.call.delete({
    where: {
      id,
    },
  });
}

export async function simulatePendingCalls() {
  const pendingCalls = await prisma.call.findMany({
    where: {
      status: "Pending",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const updatedCalls = [];

  for (const call of pendingCalls) {
    let finalStatus: "Confirmed" | "No Answer" | "Callback";

    const random = Math.random();

    if (random < 0.7) {
      finalStatus = "Confirmed";
    } else if (random < 0.9) {
      finalStatus = "No Answer";
    } else {
      finalStatus = "Callback";
    }

    const analysisByStatus = {
      Confirmed: {
        duration: "01:24",
        transcript:
          "AI: Hello, this is OmniAI calling to confirm your recent order. Customer: Yes, I confirm the order. AI: Perfect, your order will be prepared for delivery.",
        summary:
          "The customer answered the call and successfully confirmed the order.",
        confidence: 98,
      },

      "No Answer": {
        duration: "00:18",
        transcript:
          "AI: Hello, this is OmniAI calling to confirm your order. The customer did not answer the call.",
        summary:
          "The customer did not answer. Another call attempt is recommended.",
        confidence: 95,
      },

      Callback: {
        duration: "00:57",
        transcript:
          "AI: Hello, this is OmniAI calling to confirm your order. Customer: I am currently busy. Please call me back later.",
        summary:
          "The customer requested another call at a later time.",
        confidence: 96,
      },
    };

    const analysis = analysisByStatus[finalStatus];

    const updatedCall = await prisma.call.update({
      where: {
        id: call.id,
      },
      data: {
        status: finalStatus,
        duration: analysis.duration,
        transcript: analysis.transcript,
        summary: analysis.summary,
        confidence: analysis.confidence,
        recordingUrl: "http://localhost:4000/recordings/demo-call.mp3",
      },
    });

    if (call.orderId) {
      await prisma.order.update({
        where: {
          id: call.orderId,
        },
        data: {
          callStatus: finalStatus,
        },
      });
    }

    updatedCalls.push(updatedCall);
  }

  return updatedCalls;
}