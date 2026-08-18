import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./config/prisma.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();

    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();