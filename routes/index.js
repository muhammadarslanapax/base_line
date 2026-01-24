const router = require("express").Router();

router.use(require("../controllers/user/index.js"));
router.use(require("../controllers/auth/index.js"));
router.use(require("../controllers/business/index.js"));
router.use(require("../controllers/subscription_plan/index.js"));
router.use(require("../controllers/service/index.js"));
router.use(require("../controllers/booking/index.js"));
router.use(require("../controllers/chat/index.js"));
router.use(require("../controllers/other/index.js"));









module.exports = router;
