const Joi = require('joi');

const createBusiness = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(5).max(500).required(),
  
  address: Joi.string().trim().min(5).max(200).required(),
  categoryIds: Joi.array().items(Joi.string().trim()).min(1).required(),
  paymentMethodIds: Joi.array().items(Joi.string().trim()).min(1).required(),
  phone: Joi.string().trim().min(7).max(15).required(),
});

module.exports = {
  createBusiness,
};
