const router = require("express").Router();
const otherServices = require("../../services/other/index");
const {upload}= require('../../utils/multer');




router.post('/upload-file' ,upload.single("file"), otherServices.uploadFileToAws);
router.post('/upload-files', upload.array("files", 10), otherServices.uploadFilesToAws);



module.exports = router;
