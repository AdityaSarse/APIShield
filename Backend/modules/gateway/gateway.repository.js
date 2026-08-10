import prisma from "../../config/prisma.js";

export const createRequestLog = (data) => {
  return prisma.requestLog.create({
    data,
  });
};
