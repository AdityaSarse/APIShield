import redis from "../config/redis.js";
import prisma from "../config/prisma.js";

afterAll(async () => {
  if (redis.isOpen) {
    await redis.quit();
  }

  await prisma.$disconnect();
});
