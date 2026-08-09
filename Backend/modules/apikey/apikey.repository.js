import prisma from "../../config/prisma.js";

export const createApiKey = async (data) => {
  return prisma.apiKey.create({
    data,
  });
};

export const findApiKeysByUserId = async (userId) => {
  return prisma.apiKey.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      prefix: true,
      revoked: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
