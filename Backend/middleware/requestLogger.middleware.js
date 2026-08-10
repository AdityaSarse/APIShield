import * as gatewayRepository from "../modules/gateway/gateway.repository.js";

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const responseTime = Date.now() - startTime;

    try {
      await gatewayRepository.createRequestLog({
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        responseTime,
        ipAddress: req.ip || req.socket.remoteAddress || null,
        userAgent: req.get("user-agent") || null,
        apiKeyId: req.apiKey?.id || null,
      });
    } catch (error) {
      console.error("Failed to log request:", error);
    }
  });

  next();
};

export default requestLogger;
