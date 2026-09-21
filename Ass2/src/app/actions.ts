"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendTransactionEmail, sendCustomEmail } from "@/lib/email";

export async function setRoleAction(role: string) {
  const cookieStore = await cookies();
  cookieStore.set("app-role", role, { path: "/" });
  revalidatePath("/");
  return { success: true, role };
}

export async function getRoleAction() {
  const cookieStore = await cookies();
  return cookieStore.get("app-role")?.value || "Member";
}

export async function createTransactionAction(data: {
  amount: number;
  userEmail?: string;
}) {
  const cookieStore = await cookies();
  const currentRole = cookieStore.get("app-role")?.value || "Member";

  if (currentRole === "Guest") {
    return {
      success: false,
      message: "Access Denied: Guests cannot process transactions.",
    };
  }

  const targetEmail = data.userEmail?.trim() || "customer@example.com";
  
  let user = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (!user) {
    let role = await prisma.role.findFirst({
      where: { name: currentRole },
    });
    if (!role) {
      role = await prisma.role.create({
        data: { name: currentRole, description: `${currentRole} role` },
      });
    }

    user = await prisma.user.create({
      data: {
        email: targetEmail,
        name: targetEmail.split("@")[0],
        roleId: role.id,
      },
    });
  }

  const reference = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      amount: data.amount,
      status: "completed",
      reference,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "TRANSACTION_MUTATION",
      details: `Created transaction ${transaction.reference} ($${transaction.amount}) under role ${currentRole}`,
    },
  });

  const emailLog = await sendTransactionEmail({
    userId: user.id,
    transactionId: transaction.id,
    userEmail: user.email,
    userName: user.name,
    transactionRef: transaction.reference,
    amount: transaction.amount,
  });

  revalidatePath("/");

  return {
    success: true,
    message: `Transaction ${transaction.reference} created successfully.`,
    transaction,
    emailLog,
  };
}

export async function sendCustomEmailAction(data: {
  to: string;
  subject: string;
  body: string;
}) {
  const cookieStore = await cookies();
  const currentRole = cookieStore.get("app-role")?.value || "Member";

  if (currentRole === "Guest") {
    return {
      success: false,
      message: "Access Denied: Guests cannot send emails.",
    };
  }

  const targetEmail = data.to.trim();
  if (!targetEmail) {
    return { success: false, message: "Please provide a valid recipient email." };
  }

  let user = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (!user) {
    let role = await prisma.role.findFirst({
      where: { name: currentRole },
    });
    if (!role) {
      role = await prisma.role.create({
        data: { name: currentRole, description: `${currentRole} role` },
      });
    }

    user = await prisma.user.create({
      data: {
        email: targetEmail,
        name: targetEmail.split("@")[0],
        roleId: role.id,
      },
    });
  }

  const emailLog = await sendCustomEmail({
    toEmail: user.email,
    subject: data.subject || "Notification",
    bodyText: data.body || "No message body provided.",
    userId: user.id,
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "EMAIL_DISPATCHED",
      details: `Sent email "${data.subject}" to ${user.email}`,
    },
  });

  revalidatePath("/");

  return {
    success: true,
    message: `Email sent to ${user.email} successfully.`,
    emailLog,
  };
}

export async function triggerWebhookAction(
  resendId: string,
  eventType: "email.delivered" | "email.bounced" | "email.opened"
) {
  const emailLog = await prisma.emailLog.findUnique({
    where: { resendId },
  });

  if (!emailLog) {
    return { success: false, message: "Email record not found" };
  }

  const updatedLog = await prisma.emailLog.update({
    where: { resendId },
    data: {
      status: eventType.replace("email.", ""),
      eventPayload: JSON.stringify({
        event: eventType,
        resend_id: resendId,
        timestamp: new Date().toISOString(),
      }),
    },
  });

  revalidatePath("/");

  return {
    success: true,
    message: `Updated log status to ${updatedLog.status}`,
    emailLog: updatedLog,
  };
}
