
const {uploadFile} = require('../../utils/aws')

const { STATUS_CODES } = require('../../config/constants');



const asyncHandler = require('../../utils/asycHandler');

  const uploadFileToAws = asyncHandler(async (req, res) => {
    try{
      

  
      if (!req.file) {
        return res.status(400).json({
          statusCode: 400,
          message: "No file uploaded",
        });
      }

        const data = await uploadFile(req.file)
    

       
        res.status(200).json(data);
    
      }catch(err){
        console.log("error : ",err)
      }

  });

// ---------------- MULTIPLE FILES UPLOAD ----------------
const uploadFilesToAws = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json(new apiResponse(400, "No files uploaded"));
  }

  // Upload each file to AWS
  const uploadedFiles = [];
  for (const file of req.files) {
    const data = await uploadFile(file);
    uploadedFiles.push(data);
  }

  res.status(200).json(uploadedFiles);
});

module.exports = {
  uploadFileToAws,
  uploadFilesToAws,
};
