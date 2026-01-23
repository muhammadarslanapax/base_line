const router = require("express").Router();
const authServices = require("../../services/auth/index");
const validation = require("../../middlewares/validationSchemas/signup");
const login = require("../../middlewares/validationSchemas/login");

const { validateBody } = require("../../middlewares/validator");
router.post("/auth/signup",validateBody(validation.emailSignUp),   authServices.signUp);
router.post("/auth/socialAuth",validateBody(validation.socialSignUp),   authServices.socialAuth);

router.post("/auth/login",validateBody(login.login),   authServices.login);
router.post("/auth/varifyOtp",validateBody(validation.varifyEmail),   authServices.verifyEmailOTP);



module.exports = router;
