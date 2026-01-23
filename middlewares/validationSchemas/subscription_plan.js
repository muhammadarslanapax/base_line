const Joi = require("joi");

const subscriptionPlane = Joi.object({
    name: Joi.string().trim().required(),
    durationMonths: Joi.required(),
    pricePerMonth: Joi.required(),
    totalPrice: Joi.required(),
    isBestValue: Joi.required(),
  


});


const activatePlanSchema = Joi.object({
  planId: Joi.string().required(),
  paymentMethod: Joi.string().valid("card", "paypal").required(),
  cardInfo: Joi.when("paymentMethod", {
    is: "card",
    then: Joi.object({
      number: Joi.string().creditCard().required(),
      expMonth: Joi.number().min(1).max(12).required(),
      expYear: Joi.number().min(new Date().getFullYear()).required(),
      cvc: Joi.string().length(3).required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  paypalPaymentId: Joi.when("paymentMethod", {
    is: "paypal",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});



module.exports = {
  subscriptionPlane,
  activatePlanSchema

};



