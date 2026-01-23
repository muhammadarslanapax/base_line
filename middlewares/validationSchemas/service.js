const Joi = require("joi");

const create_service = Joi.object({
  title: Joi.string().trim().min(3).required(),

  description: Joi.string().trim().min(5).required(),

  price: Joi.number().positive().required(),

  durationInMinutes: Joi.number().integer().positive().required(),

  images: Joi.array()
    .items(Joi.string().uri().allow("", null))
    .default([]),

    categoryId: Joi.string()
    .uuid()
    .required()
    ,

  paymentMethods: Joi.array()
    .items(Joi.string().uuid()).required()
    
    

});

module.exports = {
  create_service,
};
