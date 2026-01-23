const asyncHandler = require("../../utils/asycHandler");
const apiResponse = require("../../utils/apiResponse");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const {User,Business,PaymentMethod,Category} = require("../../models")
const apiError = require("../../utils/apiError");


const getProfile = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  let user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: Business,
        as: 'business', 
        required: false,
      },
    ],
  });

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json(
      new apiResponse(STATUS_CODES.NOT_FOUND, "User not found")
    );
  }

  user = user.get({ plain: true });

  const { password, accessToken, ...safeUser } = user;

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, TEXTS.USER_FETCH, safeUser)
  );
});




const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { name, email, country, city,deviceToken } = req.body;

  // Only update allowed fields
  const allowedUpdates = { name, email, country, city,deviceToken };

  // Remove undefined keys
  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  // If no fields provided
  if (Object.keys(allowedUpdates).length === 0) {

    throw new apiError(STATUS_CODES.BAD_REQUEST,"Nothing to update")
     
    
   
  }

  // Find user
  const user = await User.findByPk(userId);

  if (!user) {
    throw new apiError(STATUS_CODES.NOT_FOUND,"User not found")

   
  }

  // Update user
  await user.update(allowedUpdates);

  // Return updated profile
  const updatedUser = user.get({ plain: true });

  // Remove sensitive fields
  const { password, accessToken, ...safeUser } = updatedUser;

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Profile updated successfully", safeUser)
  );
});





module.exports = {
  getProfile,
  updateProfile
 
  
};
