import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const resendId = data?.email_id || data?.id || body?.resend_id;

    if (!resendId) {
      return NextResponse.json(
        { error: "Missing resend email identifier" },
        { status: 400 }
      );
    }

    let updatedStatus = "sent";
    if (type === "email.delivered") {
      updatedStatus = "delivered";
    } else if (type === "email.bounced") {
      updatedStatus = "bounced";
    } else if (type === "email.opened") {
      updatedStatus = "opened";
    }

    const existingLog = await prisma.emailLog.findUnique({
      where: { resendId },
    });

    if (existingLog) {
      const updatedLog = await prisma.emailLog.update({
        where: { resendId },
        data: {
          status: updatedStatus,
          eventPayload: JSON.stringify(body),
        },
      });
      return NextResponse.json({ success: true, log: updatedLog });
    }

    return NextResponse.json(
      { message: "Log record not found for webhook resend ID" },
      { status: 444 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
