const asyncHandler = require("../../utils/asycHandler");
const apiResponse = require("../../utils/apiResponse");
const apiError = require("../../utils/apiError");

const { STATUS_CODES, TEXTS } = require("../../config/constants");
const {User} = require("../../models")
const { generateHashPassword, verifyHashPassword } = require("../../utils/hashPassword");
const {generateToken} = require("../../utils/jwtToken");
const { generateOTP } = require("../../utils/helpers-functions");
const { storeOTP, getOTP, deleteOTP } = require("../../utils/redis");
const { sendOTPEmail } = require("../../utils/email");
const { auth } = require("../../utils/firebaseFunctions");



const signUp = asyncHandler(async (req, res) => {

  const {country,city,type,name,email,password,phone,method,role} = req.body;

  const existingUser = await User.findOne({
  where:{
      email:email,
    phone:phone
  }

  })
  if(existingUser){
    
    throw new apiError(STATUS_CODES.CONFLICT,TEXTS.CONFLICT)

  }

  

  const psd = await generateHashPassword(password);
  


   await User.create({
    phone:phone,
    country:country,email:email,password:psd,name:name,city:city,type:type,method:method,role:role})

  res.status(STATUS_CODES.CREATED).json(
    new apiResponse(STATUS_CODES.CREATED, TEXTS.REGISTER)
  );
});




const login = asyncHandler(async (req, res) => {

  const {email,password,role} = req.body;

  const existingUser = await User.findOne({
    where: { email: email,role:role }
    

  })
  if(!existingUser){
    
    throw new apiError(STATUS_CODES.NOT_FOUND,TEXTS.NOT_FOUND)

  }


  const isMatch = await verifyHashPassword(password,existingUser.password);

  if(!isMatch){
    throw new apiError(STATUS_CODES.NOT_FOUND,TEXTS.INVALID_CREDENTIALS)


  }
  




 
 


const otp = generateOTP(6);
await storeOTP(email, otp);


await sendOTPEmail(email, otp);

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "OTP sent successfully to your email",{
      email: email,
    })
  );

 
});


const verifyEmailOTP = asyncHandler(async (req, res) => {

  const {email, otp } = req.body;
  

  const user = await User.findOne({
    where: {
      email: email,
     
    },
    raw: true
  });

  if(!user){
    
    throw new apiError(STATUS_CODES.NOT_FOUND,TEXTS.NOT_FOUND)

  }

  let storedOTP;
  storedOTP = await getOTP(email);


  if(!storedOTP){
    
    throw new apiError(STATUS_CODES.BAD_REQUEST,"OTP has expired or not found. Please request a new OTP.")

  }

  if (storedOTP !== otp) {
    throw new apiError(STATUS_CODES.UNAUTHORIZED,"Invalid OTP. Please try again.")


  }

  await deleteOTP(email);




  

  const accessToken =await generateToken(user);



 
  await User.update(
    { accessToken: accessToken },              
    { where: { id: user.id } }          
  );






 res.status(200).json(
    new apiResponse(STATUS_CODES.SUCCESS, TEXTS.LOGIN,{
      accessToken: user.accessToken,
    })
  );

 
});



const socialAuth = asyncHandler(async (req, res) => {

  const {uid,role,method} = req.body;

  let firebaseUser;

  try {
    firebaseUser = await auth.getUser(uid);
  } catch (error) {
    throw new apiError(
      STATUS_CODES.NOT_FOUND,
      "Invalid UID. User not found in Firebase."
    );
  }


  let fbUser = firebaseUser['providerData'][0] || null;
  // Check if user exists in database
  let user = await User.findOne({
    where: {
      uid: uid,
      role: role
    },
    raw : true
  });

  if(!user){
    user = await User.create({
      uid: uid,
      email: fbUser?.email || null,
      name: fbUser?.displayName || null,
      phone: fbUser?.phoneNumber || null,
      image: fbUser?.photoURL || null,
      method: method,
      role: role
    });
  }


  





  const accessToken = await generateToken(user);

  // Save access token
  await User.update(
    { accessToken },
    { where: { id: user.id } }
  );
  
  // Fetch the updated user
  user = await User.findOne({
    where: { id: user.id },
    raw: true
  });
  
  // Send correct token
  res.status(200).json(
    new apiResponse(STATUS_CODES.SUCCESS, TEXTS.LOGIN, {
      accessToken: user.accessToken,
    })
  );
  


 
 




  

 
});



module.exports = {
  signUp,
  login,
  verifyEmailOTP,
  socialAuth
};
