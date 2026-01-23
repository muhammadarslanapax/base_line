const { verifyJWTToken } = require("../utils/jwtToken");
const { STATUS_CODES, TEXTS } = require("../config/constants");
const ApiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");


const authenticate = async (req, res, next) => {
  const header = req.get("Authorization");
  if (!header || !header.startsWith("Bearer")) {
 return   res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.UNAUTHORIZED, TEXTS.UN_AUTHORIZED)
    );
  }

  const accessToken = header.split(" ")[1];
  if (accessToken) {
    const result = await verifyJWTToken(accessToken);
    if (result.err) {
      return res.status(STATUS_CODES.SUCCESS).json(
        new apiResponse(STATUS_CODES.UNAUTHORIZED, TEXTS.UN_AUTHORIZED)
      );
    } else {
      req.user = result.decoded;
      next();
    }
  } else {
    return  res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.UNAUTHORIZED, TEXTS.UN_AUTHORIZED)
    );
  }
};

module.exports = {
  authenticate,
};
