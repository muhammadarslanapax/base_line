const router = require("express").Router();
const subscriptionServices = require("../../services/subscription_plan/index");
const subscriptionValidator = require("../../middlewares/validationSchemas/subscription_plan");

const { validateBody } = require("../../middlewares/validator");


router.post('/subscription-plan' ,validateBody(subscriptionValidator.subscriptionPlane), subscriptionServices.createPlan);
router.get('/subscription-plan',subscriptionServices. getAllPlans);
router.get('/subscription-plan/:id',subscriptionServices. getPlan);
router.patch('/subscription-plan/:id', subscriptionServices.updatePlan);
router.delete('/subscription-plan/:id',subscriptionServices. deletePlan);

router.post('/activate-subscription-plan' ,validateBody(subscriptionValidator.activatePlanSchema), subscriptionServices.activatePlan);



module.exports = router;
