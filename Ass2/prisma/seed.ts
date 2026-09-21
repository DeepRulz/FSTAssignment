import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.emailLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      description: "Full system administration access",
    },
  });

  const memberRole = await prisma.role.create({
    data: {
      name: "Member",
      description: "Standard registered user access",
    },
  });

  const guestRole = await prisma.role.create({
    data: {
      name: "Guest",
      description: "Limited read-only visitor access",
    },
  });

  const roles = [adminRole, memberRole, guestRole];

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "System Admin",
      roleId: adminRole.id,
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      email: "member@example.com",
      name: "Standard Member",
      roleId: memberRole.id,
    },
  });

  const createdUsers = [adminUser, memberUser];

  for (let i = 0; i < 5; i++) {
    const randomRole = faker.helpers.arrayElement(roles);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.fullName(),
        roleId: randomRole.id,
      },
    });
    createdUsers.push(user);
  }

  for (const user of createdUsers) {
    const txCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < txCount; j++) {
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 })),
          status: "completed",
          reference: `TX-${faker.string.alphanumeric(8).toUpperCase()}`,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "TRANSACTION_CREATED",
          details: `Processed transaction ${transaction.reference} of $${transaction.amount}`,
        },
      });

      const resendId = `msg_${faker.string.alphanumeric(16)}`;
      await prisma.emailLog.create({
        data: {
          userId: user.id,
          transactionId: transaction.id,
          emailType: "TRANSACTION_RECEIPT",
          status: faker.helpers.arrayElement(["sent", "delivered", "bounced"]),
          resendId: resendId,
          eventPayload: JSON.stringify({
            event: "email.sent",
            resend_id: resendId,
            timestamp: new Date().toISOString(),
          }),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        details: `User ${user.email} logged in from ${faker.internet.ip()}`,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
