import authRoutes from "./auth.routes.js";

export { authRoutes };
export * as authController from "./auth.controller.js";
export * from "./auth.profile.controller.js";
export * as authRepository from "./auth.repository.js";
export * from "./auth.validation.js";
export * from "./services/register.service.js";
export * from "./services/login.service.js";
export * from "./services/logout.service.js";
export * from "./services/refreshToken.service.js";

export default authRoutes;
