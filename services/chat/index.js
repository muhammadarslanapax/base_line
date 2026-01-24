const { Chat, Message, User } = require("../../models");
const asyncHandler = require("../../utils/asycHandler");
const apiError = require("../../utils/apiError");
const apiResponse = require("../../utils/apiResponse");
const { Op } = require('sequelize'); // for [Op.or]

let getSocketIO;
try {
  getSocketIO = require("../../utils/socket").getSocketIO;
} catch (e) {
  getSocketIO = () => null;
}

const io = getSocketIO();


// ---------------- SEND MESSAGE ----------------
const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, type, content, mediaUrl } = req.body;

  if (!receiverId) throw new apiError(400, "receiverId is required");

  if (senderId === receiverId)
    throw new apiError(400, "You cannot send a message to yourself");

  const receiver = await User.findByPk(receiverId);
  if (!receiver) throw new apiError(404, "Receiver not found");

  // 1️⃣ Find or create chat
  let chat = await Chat.findOne({
    where: {
      user1Id: senderId,
      user2Id: receiverId,
    },
  });

  if (!chat) {
    // check reverse combination
    chat = await Chat.findOne({
      where: {
        user1Id: receiverId,
        user2Id: senderId,
      },
    });
  }

  if (!chat) {
    chat = await Chat.create({
      user1Id: senderId,
      user2Id: receiverId,
      lastMessage: type === "text" ? content : type,
      lastMessageAt: new Date(),
    });
  }

  // 2️⃣ Create message
  const message = await Message.create({
    chatId: chat.id,
    senderId,
    receiverId,
    type,
    content,
    mediaUrl,
  });

  // 3️⃣ Update chat metadata
  await chat.update({
    lastMessage: type === "text" ? content : type,
    lastMessageAt: new Date(),
  });
  if(io){
    io.to(receiverId).emit("new_message", message);


  }


  res.status(201).json(new apiResponse(201, "Message sent", message));
});







// ---------------- GET ALL CHATS ----------------
const getMyChats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
  
    // Fetch all chats where the logged-in user is either user1 or user2
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'user2', attributes: ['id', 'name', 'email'] },
      ],
      order: [['lastMessageAt', 'DESC']],
    });
  
    // Format chats to include only the "recipient" (other user)
    const formattedChats = chats.map(chat => {
      const recipient = chat.user1Id === userId ? chat.user2 : chat.user1;
  
      return {
        chatId: chat.id,
        lastMessageAt: chat.lastMessageAt,
        recipient: {
          id: recipient.id,
          name: recipient.name,
          email: recipient.email,
        },
      };
    });
  
    res.json(new apiResponse(200, "Chats fetched successfully", formattedChats));
  });
  



// ---------------- GET MESSAGES OF A CHAT ----------------
const getChatMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;

  const chat = await Chat.findOne({ where: { id: chatId } });
if (!chat) throw new apiError(404, "Chat not found");


  // Check if user is part of this chat
  if (![chat.user1Id, chat.user2Id].includes(userId))
    throw new apiError(403, "You are not part of this chat");

  const messages = await Message.findAll({
    where: { chatId },
    order: [['createdAt', 'ASC']],
  });

  res.json(new apiResponse(200, "Messages fetched", messages));
});



module.exports = {
    getChatMessages,
    getMyChats,
    sendMessage
   
};
