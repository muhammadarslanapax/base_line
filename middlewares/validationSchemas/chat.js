const Joi = require("joi");

// Validation schema for sending a message
const sendMessageSchema = Joi.object({
  receiverId: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "any.required": "receiverId is required",
      "string.uuid": "receiverId must be a valid UUID",
    }),
  
  type: Joi.string()
    .valid("text", "audio", "video", "image")
    .required()
    .messages({
      "any.required": "Message type is required",
      "any.only": "Type must be one of text, audio, video, image",
    }),
  
  content: Joi.string()
    .when("type", { is: "text", then: Joi.required(), otherwise: Joi.forbidden() })
    .messages({
      "any.required": "Content is required for text messages",
      "any.unknown": "Content is not allowed for non-text messages",
    }),

  mediaUrl: Joi.string()
    .uri()
    .when("type", { is: Joi.valid("audio", "video", "image"), then: Joi.required(), otherwise: Joi.forbidden() })
    .messages({
      "any.required": "mediaUrl is required for audio, video, or image messages",
      "string.uri": "mediaUrl must be a valid URL",
      "any.unknown": "mediaUrl is not allowed for text messages",
    }),
});

module.exports = {
  sendMessageSchema,
};
