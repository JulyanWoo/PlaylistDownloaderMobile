import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  logger.error({ error: err.message });
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
};

export { errorHandler };