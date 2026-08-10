import ApiResponse from "../../utils/ApiResponse.js";
import { getAnalyticsSummary } from "./analytics.service.js";

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
