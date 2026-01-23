const router = require("express").Router();
const serviceServices = require("../../services/service/index");
const serviceValidator = require("../../middlewares/validationSchemas/service");

const { validateBody } = require("../../middlewares/validator");


router.get('/service/all' , serviceServices.getAllServices);

router.post('/service' ,validateBody(serviceValidator.create_service), serviceServices.createService);

router.get('/service/:serviceId' , serviceServices.getSingleService);


router.patch('/service/:serviceId' , serviceServices.updateService);

router.delete('/service/:serviceId' , serviceServices.deleteService);

router.get('/service' , serviceServices.getMyServices);
router.get('/category/:categoryId' , serviceServices.getServicesByCategoryId);



module.exports = router;
