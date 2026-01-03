const ApiError = require("../utils/apiError");

const { STATUS_CODES, TEXTS } = require("../config/constants");

const errorHandler = (err, req, res, next) => {
  // Handle known (custom) errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Log unexpected errors
  console.error("Unhandled error:", err);

  // Handle unknown errors
  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: TEXTS.INTERNAL_SERVER_ERROR,
  });
};

module.exports = {
  errorHandler,
};
