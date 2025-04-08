// src/utils/globalExceptionHandler.js
const globalExceptionHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
      return res.status(400).json({
          success: false,
          error: "Database validation error",
          details: err.errors, 
      });
  }

  return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: err.message || "Something went wrong",
  });
};

export default globalExceptionHandler;
