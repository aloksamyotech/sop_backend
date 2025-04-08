export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("🔥 Async Error:", error); // Optional: logs the error
      next(error);
  });
};
