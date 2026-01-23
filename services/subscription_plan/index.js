const asyncHandler = require('../../utils/asycHandler');
const apiResponse = require('../../utils/apiResponse');
const apiError = require('../../utils/apiError');
const { STATUS_CODES } = require('../../config/constants');
const { SubscriptionPlan,User } = require('../../models');
const { stripe, paypal } = require("../../config/payment");


// Create a subscription plan
const createPlan = asyncHandler(async (req, res) => {


  const { name, durationMonths, pricePerMonth, isBestValue } = req.body;

  const subscriptionPlane = await SubscriptionPlan.findOne({
    where: { name: name }
  });

  if(subscriptionPlane){
    throw new apiError(STATUS_CODES.CONFLICT, "Plan already exist");

  }
  const totalPrice = durationMonths * pricePerMonth;

  const plan = await SubscriptionPlan.create({
    name,
    durationMonths,
    pricePerMonth,
    totalPrice,
    isBestValue: !!isBestValue
  });

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Subscription plan created", plan)
  );
});

// Get all plans
const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.findAll({
    order: [['durationMonths', 'ASC']]
  });
  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Plans fetched", plans)
  );
});

// Get a single plan
const getPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByPk(id);
  if (!plan) throw new apiError(STATUS_CODES.NOT_FOUND, "Plan not found");
  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Plan fetched", plan)
  );
});

// Update a plan
const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, durationMonths, pricePerMonth, isBestValue } = req.body;

  const plan = await SubscriptionPlan.findByPk(id);
  if (!plan) throw new apiError(STATUS_CODES.NOT_FOUND, "Plan not found");

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (durationMonths) updatedFields.durationMonths = durationMonths;
  if (pricePerMonth) updatedFields.pricePerMonth = pricePerMonth;
  if (durationMonths || pricePerMonth) {
    updatedFields.totalPrice =
      (updatedFields.durationMonths || plan.durationMonths) *
      (updatedFields.pricePerMonth || plan.pricePerMonth);
  }
  if (isBestValue !== undefined) updatedFields.isBestValue = isBestValue;

  await plan.update(updatedFields);

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Plan updated", plan)
  );
});

// Delete a plan
const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByPk(id);
  if (!plan) throw new apiError(STATUS_CODES.NOT_FOUND, "Plan not found");

  await plan.destroy();

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Plan deleted")
  );
});



//======================
const activatePlan = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { planId, paymentMethod, cardInfo, paypalPaymentId } = req.body;

  // 1️⃣ Get plan info
  const plan = await SubscriptionPlan.findByPk(planId);
  if (!plan) throw new apiError(STATUS_CODES.NOT_FOUND, "Plan not found");

  // 2️⃣ Process payment
  let paymentSuccess = false;

  if (paymentMethod === "card") {
    let user = await User.findOne({
      where: { id: userId },
     
    });

    // Card payment using Stripe


    // If user doesn't have a Stripe customer, create one
  //  if (!user.stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      // Save the new customer ID to user
     // user.stripeCustomerId = stripeCustomer.id;
    //  await user.save();
  //  }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.totalPrice * 100, // in cents
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method_data: {
        type: "card",
        card: {
          number: cardInfo.number,
          exp_month: cardInfo.expMonth,
          exp_year: cardInfo.expYear,
          cvc: cardInfo.cvc,
        },
      },
      confirm: true,
    });

    if (paymentIntent.status === "succeeded") paymentSuccess = true;

  } else if (paymentMethod === "paypal") {
    // PayPal payment
    const execute_payment_json = {
      payer_id: paypalPaymentId,
      transactions: [{ amount: { currency: "USD", total: plan.totalPrice.toString() } }],
    };

    await new Promise((resolve, reject) => {
      paypal.payment.execute(paypalPaymentId, execute_payment_json, function (error, payment) {
        if (error) reject(error);
        else if (payment.state === "approved") resolve(payment);
        else reject("Payment not approved");
      });
    });

    paymentSuccess = true;
  }

  if (!paymentSuccess) {
    throw new apiError(STATUS_CODES.PAYMENT_REQUIRED, "Payment failed");
  }

  // 3️⃣ Deactivate old subscriptions
  await UserSubscription.update(
    { isActive: false },
    { where: { userId, isActive: true } }
  );

  // 4️⃣ Activate new subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + plan.durationMonths);

  const userSubscription = await UserSubscription.create({
    userId,
    planId,
    startDate,
    endDate,
    isActive: true,
  });

  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(
      STATUS_CODES.SUCCESS,
      `Plan "${plan.name}" activated successfully`,
      userSubscription
    )
  );
});




module.exports = {
  createPlan,
  getAllPlans,
  getPlan,
  updatePlan,
  deletePlan,
  activatePlan
};
