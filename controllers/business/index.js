const router = require("express").Router();
const businessServices = require("../../services/business/index");

const validationSchemas = require("../../middlewares/validationSchemas/business");


const { validateBody } = require("../../middlewares/validator");


// == businss 
router.post("/business",validateBody(validationSchemas.createBusiness), businessServices.createBusiness);
router.patch("/business", businessServices.updateBusiness);


// category
router.get("/business/category", businessServices.getAllCategories);

router.post("/business/category", businessServices.createCategory);

router.get("/business/category/:id", businessServices.getCategory);

router.delete("/business/category/:id", businessServices.deleteCategory);

router.patch("/business/category/:id", businessServices.updateCategory);



// == payment-method


router.post("/business/payment-method", businessServices.createPaymentMethod);
router.get("/business/payment-method", businessServices.getAllPaymentMethod);

router.get("/business/payment-method/:id", businessServices.getPaymentMethod);

router.delete("/business/payment-method/:id", businessServices.deletePaymentMethod);

router.patch("/business/payment-method/:id", businessServices.updatePaymentMethod);




module.exports = router;
