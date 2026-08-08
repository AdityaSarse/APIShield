import prisma from "../../config/prisma.js";

export const createApiKey = async (data) => {
  return prisma.apiKey.create({
    data,
  });
};
