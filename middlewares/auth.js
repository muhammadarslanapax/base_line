const { verifyJWTToken } = require("../utils/jwtToken");
const { STATUS_CODES, TEXTS } = require("../config/constants");
const ApiError = require("../utils/apiError");

const authenticate = async (req, res, next) => {
  const header = req.get("Authorization");
  if (!header || !header.startsWith("Bearer")) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, TEXTS.INVALID_AUTH_TOKEN);
  }

  const accessToken = header.split(" ")[1];
  if (accessToken) {
    const result = await verifyJWTToken(accessToken);
    if (result.err) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, TEXTS.INVALID_AUTH_TOKEN);
    } else {
      req.user = result.decoded;
      next();
    }
  } else {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, TEXTS.INVALID_AUTH_TOKEN);
  }
};

module.exports = {
  authenticate,
};
