const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
};

export default notFound;
