import ApiResponse from "../../utils/ApiResponse.js";

export const adminDashboard = (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "Welcome Admin",
      {
        user: req.user
      }
    )
  );
};
