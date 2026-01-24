const router = require("express").Router();
const chatServices = require("../../services/chat/index");

 const validationSchemas = require("../../middlewares/validationSchemas/chat");


 const { validateBody } = require("../../middlewares/validator");


// == businss 
router.post("/chat/send-msg",validateBody(validationSchemas.sendMessageSchema), chatServices.sendMessage);


router.get("/chat", chatServices.getMyChats);
router.get("/messages/:chatId", chatServices.getChatMessages);




module.exports = router;
