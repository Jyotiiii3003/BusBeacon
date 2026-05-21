export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate record", details: err.keyValue });
  }
  console.error(err);
  res.status(status).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}
