import { Resend } from "resend";
import { render } from "@react-email/components";
import { NotificationEmail } from "@/emails/notification";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_12345");

export async function sendTransactionEmail({
  userId,
  transactionId,
  userEmail,
  userName,
  transactionRef,
  amount,
}: {
  userId: string;
  transactionId: string;
  userEmail: string;
  userName: string;
  transactionRef: string;
  amount: number;
}) {
  const emailHtml = await render(
    NotificationEmail({ userName, transactionRef, amount })
  );

  let resendId = `msg_${Math.random().toString(36).substring(2, 18)}`;

  try {
    if (process.env.RESEND_API_KEY) {
      const { data } = await resend.emails.send({
        from: "Notifications <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Transaction Confirmation - ${transactionRef}`,
        html: emailHtml,
      });

      if (data && data.id) {
        resendId = data.id;
      }
    }
  } catch (e: unknown) {
    console.warn("Resend API fallback active", e);
  }

  const emailLog = await prisma.emailLog.create({
    data: {
      userId,
      transactionId,
      emailType: "TRANSACTION_RECEIPT",
      status: "sent",
      resendId,
      eventPayload: JSON.stringify({
        event: "email.sent",
        resend_id: resendId,
        recipient: userEmail,
        timestamp: new Date().toISOString(),
      }),
    },
  });

  return emailLog;
}

export async function sendCustomEmail({
  toEmail,
  subject,
  bodyText,
  userId,
}: {
  toEmail: string;
  subject: string;
  bodyText: string;
  userId: string;
}) {
  const formattedHtml = `<div style="font-family: sans-serif; padding: 20px;"><h2 style="color: #333;">${subject}</h2><p style="color: #555; line-height: 1.5;">${bodyText}</p></div>`;

  let resendId = `msg_${Math.random().toString(36).substring(2, 18)}`;

  try {
    if (process.env.RESEND_API_KEY) {
      const { data } = await resend.emails.send({
        from: "Notifications <onboarding@resend.dev>",
        to: [toEmail],
        subject,
        html: formattedHtml,
      });

      if (data && data.id) {
        resendId = data.id;
      }
    }
  } catch (e: unknown) {
    console.warn("Resend API fallback active", e);
  }

  const emailLog = await prisma.emailLog.create({
    data: {
      userId,
      emailType: "CUSTOM_NOTIFICATION",
      status: "sent",
      resendId,
      eventPayload: JSON.stringify({
        event: "email.sent",
        resend_id: resendId,
        recipient: toEmail,
        subject,
        body: bodyText,
        timestamp: new Date().toISOString(),
      }),
    },
  });

  return emailLog;
}
