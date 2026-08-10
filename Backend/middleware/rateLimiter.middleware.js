import redis from "../config/redis.js";
import ApiError from "../utils/ApiError.js";

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUEST_LIMIT = 5;

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.apiKey?.id || req.ip;
    const redisKey = `ratelimit:${identifier}`;

    const requests = await redis.incr(redisKey);

    if (requests === 1) {
      await redis.expire(redisKey, WINDOW_SIZE_IN_SECONDS);
    }

    const ttl = await redis.ttl(redisKey);
    const remaining = Math.max(0, MAX_REQUEST_LIMIT - requests);

    res.setHeader("X-RateLimit-Limit", MAX_REQUEST_LIMIT);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("Retry-After", ttl > 0 ? ttl : WINDOW_SIZE_IN_SECONDS);

    if (requests > MAX_REQUEST_LIMIT) {
      throw new ApiError(429, "Rate limit exceeded. Try again later.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default rateLimiter;
