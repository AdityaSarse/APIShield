import redis from "../config/redis.js";
import ApiError from "../utils/ApiError.js";
import { createRequestLog } from "../modules/gateway/gateway.repository.js";

export const WINDOW_SIZE_IN_SECONDS = 60;
export const MAX_REQUEST_LIMIT = 5;

const ACTIVE_KEYS_SET = "ratelimit:active";

const rateLimiter = async (req, res, next) => {
  const startTime = Date.now();

  const identifier = req.apiKey?.id || req.ip;
  const redisKey = `ratelimit:${identifier}`;

  let requests;
  let ttl;

  try {
    requests = await redis.incr(redisKey);

    if (requests === 1) {
      await redis.expire(redisKey, WINDOW_SIZE_IN_SECONDS);
    }

    // Keep track of identifiers currently participating in rate limiting.
    await redis.sAdd(ACTIVE_KEYS_SET, identifier);

    ttl = await redis.ttl(redisKey);
  } catch (redisError) {
    console.error("Redis rate limiter failed (failing open):", redisError);
    // Fail-open strategy: rate limiter degrades gracefully when Redis is unreachable,
    // allowing core API traffic through while tagging response with degradation header.
    res.setHeader("X-RateLimit-Degraded", "true");
    return next();
  }

  try {
    const remaining = Math.max(0, MAX_REQUEST_LIMIT - requests);

    res.setHeader("X-RateLimit-Limit", MAX_REQUEST_LIMIT);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader(
      "Retry-After",
      ttl > 0 ? ttl : WINDOW_SIZE_IN_SECONDS
    );

    if (requests > MAX_REQUEST_LIMIT) {
      try {
        await createRequestLog({
          method: req.method,
          path: req.originalUrl || req.url,
          statusCode: 429,
          responseTime: Date.now() - startTime,
          ipAddress: req.ip || req.socket?.remoteAddress || null,
          userAgent: req.get?.("user-agent") || null,
          apiKeyId: req.apiKey?.id || null,
        });
      } catch (logError) {
        console.error("Failed to log 429 rate limit rejection:", logError);
      }

      throw new ApiError(429, "Rate limit exceeded. Try again later.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default rateLimiter;
