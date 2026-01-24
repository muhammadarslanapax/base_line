const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

console.log("AWS_REGION:", process.env.AWS_REGION); 
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
   
module.exports.uploadFile = async (file, folder = 'documents') => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("File uploaded successfully:", data);

    return {
      url: `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
      fileName: params.Key,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};