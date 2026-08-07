const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
