import ApiResponse from "../../utils/ApiResponse.js";

export const getProfile = async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile fetched successfully",
      req.user
    )
  );
};
