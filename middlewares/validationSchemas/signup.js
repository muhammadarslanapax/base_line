const Joi = require("joi");

const emailSignUp = Joi.object({
  country: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
  method: Joi.string().valid("email").required(),
  role: Joi.string().valid("user", "business","admin").required(),


});

const socialSignUp = Joi.object({
  uid: Joi.string().trim().required(),
  method: Joi.string().valid("google", "facebook", "apple").required(),
  role: Joi.string().valid("user", "business","admin").required(),

});

const varifyEmail = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().trim().required(),



});


// 👇 Export as object
module.exports = {
  emailSignUp,
  socialSignUp,
  varifyEmail
};
