import { createProxyMiddleware } from "http-proxy-middleware";
import ApiError from "../../utils/ApiError.js";
import { serviceRegistry } from "./serviceRegistry.js";

const proxyCache = new Map();

export const getServiceProxy = (serviceName) => {
  const service = serviceRegistry[serviceName];

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (proxyCache.has(serviceName)) {
    return proxyCache.get(serviceName);
  }

  const proxy = createProxyMiddleware({
    target: service.target,
    changeOrigin: true,

    on: {
      proxyReq: (proxyReq, req) => {
        console.log(
          `[Gateway] ${req.method} ${req.originalUrl} -> ${service.target}${req.url}`
        );
      },

      error: (err, req, res) => {
        console.error(
          `[Gateway] Proxy error for ${serviceName}:`,
          err.message
        );

        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            statusCode: 502,
            message: `Target service '${serviceName}' is unreachable at ${service.target}`,
          });
        }
      },
    },

    pathRewrite: (path) => {
      if (path === "/") {
        return `/${serviceName}`;
      }

      return `/${serviceName}${path}`;
    },
  });

  proxyCache.set(serviceName, proxy);

  return proxy;
};