import { createProxyMiddleware } from "http-proxy-middleware";

export const userServiceProxy = createProxyMiddleware({
  target: "http://localhost:8000",
  changeOrigin: true,

  pathRewrite: {
    "^/": "/users",
  },
});