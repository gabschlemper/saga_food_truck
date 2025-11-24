function errorHandler(err, req, res, next) {
  console.error("🔥 Error:", err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV !== "production" ? err : undefined,
  });
}

module.exports = errorHandler;
