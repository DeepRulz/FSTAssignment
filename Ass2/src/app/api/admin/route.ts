import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const roleHeader = req.headers.get("x-user-role");

  if (roleHeader !== "Admin") {
    return NextResponse.json(
      { error: "Forbidden: Admin access only" },
      { status: 403 }
    );
  }

  const userCount = await prisma.user.count();
  const transactionCount = await prisma.transaction.count();
  const auditLogCount = await prisma.auditLog.count();
  const emailLogCount = await prisma.emailLog.count();

  return NextResponse.json({
    status: "authorized",
    role: roleHeader,
    metrics: {
      userCount,
      transactionCount,
      auditLogCount,
      emailLogCount,
    },
  });
}
