const router = require("express").Router();
const userServices = require("../../services/user/index");

const validationSchemas = require("../../middlewares/validationSchemas/business");


const { validateBody } = require("../../middlewares/validator");
router.get("/user/profile", userServices.getProfile);
router.patch("/user/profile", userServices.updateProfile);






module.exports = router;
