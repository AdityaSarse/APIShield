import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function main() {
  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be configured."
    );
  }

  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD must contain at least 8 characters.");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      await prisma.user.update({
        where: {
          id: existingAdmin.id,
        },
        data: {
          role: "admin",
          status: true,
        },
      });

      console.log(`Promoted ${adminEmail} to admin.`);
    } else {
      console.log(`Admin ${adminEmail} already exists.`);
    }

    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      status: true,
    },
  });

  console.log(`Admin account created: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
