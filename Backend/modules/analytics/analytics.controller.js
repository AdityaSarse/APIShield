import ApiResponse from "../../utils/ApiResponse.js";
import {
  getAnalyticsSummary,
  getStatusCodeAnalytics,
  getServiceAnalytics,
} from "./analytics.service.js";

export const analyticsSummary = async (req, res, next) => {
  try {
    const summary = await getAnalyticsSummary();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Analytics summary fetched successfully",
        summary
      )
    );
  } catch (error) {
    next(error);
  }
};

export const statusCodeAnalytics = async (req, res, next) => {
  try {
    const analytics = await getStatusCodeAnalytics();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Status code analytics fetched successfully",
        analytics
      )
    );
  } catch (error) {
    next(error);
  }
};

export const serviceAnalytics = async (req, res, next) => {
  try {
    const analytics = await getServiceAnalytics();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Service analytics fetched successfully",
        analytics
      )
    );
  } catch (error) {
    next(error);
  }
};
