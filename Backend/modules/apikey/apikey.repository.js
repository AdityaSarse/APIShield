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

export const findApiKeyById = async (id, userId) => {
  return prisma.apiKey.findFirst({
    where: {
      id,
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
      updatedAt: true,
    },
  });
};

export const findApiKeyByIdForUpdate = async (id, userId) => {
  return prisma.apiKey.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const findApiKeyByHash = async (keyHash) => {
  return prisma.apiKey.findFirst({
    where: {
      keyHash,
    },
    include: {
      user: true,
    },
  });
};

export const revokeApiKey = async (id) => {
  return prisma.apiKey.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
    select: {
      id: true,
      name: true,
      revoked: true,
      updatedAt: true,
    },
  });
};

export const updateApiKey = async (id, data) => {
  return prisma.apiKey.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });
};

export const updateLastUsedAt = async (id) => {
  return prisma.apiKey.update({
    where: {
      id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });
};
