const Joi = require("joi");

const login = Joi.object({
  
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "business").required(),


 
});



// 👇 Export as object
module.exports = {
  login,
  
};
