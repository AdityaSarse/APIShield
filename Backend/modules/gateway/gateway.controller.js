import ApiResponse from "../../utils/ApiResponse.js";
import { getServiceProxy } from "./proxyFactory.js";

export const gatewayHealth = (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "Gateway is running",
      {
        gateway: "APIShield",
        authenticatedUser: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
        apiKey: {
          id: req.apiKey.id,
          prefix: req.apiKey.prefix,
          lastUsedAt: req.apiKey.lastUsedAt,
        },
      }
    )
  );
};

export const proxyRequest = (req, res, next) => {
  const { service } = req.params;

  const proxy = getServiceProxy(service);

  return proxy(req, res, next);
};
