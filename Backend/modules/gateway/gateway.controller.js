import ApiResponse from "../../utils/ApiResponse.js";

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
