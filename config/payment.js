// config/payment.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", // or "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = { stripe, paypal };
