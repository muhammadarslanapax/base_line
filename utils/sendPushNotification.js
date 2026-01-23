const admin = require("./firebaseFunctions");

/**
 * Send push notification via FCM
 * @param {string} token - Device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Optional data payload
 */
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!token) return;

  const message = {
    token,
    notification: { title, body },
    data: data,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Push notification sent:", response);
  } catch (error) {
    console.error("Push notification error:", error);
  }
};

module.exports = { sendPushNotification };
