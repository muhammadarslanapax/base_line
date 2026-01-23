const nodemailer = require("nodemailer");

// Helper to parse boolean from env
const parseBoolean = (value) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return Boolean(value);
};

// Create reusable transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST?.trim(),
//   port: parseInt(process.env.SMTP_PORT?.trim() || '587'),
//   secure: parseBoolean(process.env.SMTP_SECURE?.trim()), // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER?.trim(),
//     pass: process.env.SMTP_PASSWORD?.trim(),
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Send OTP email
 * @param {string} to - Recipient email address
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - Email send result
 */
const sendOTPEmail = async (to, otp) => {
  try {
    // Validate email configuration
    if (
      !process.env.MAIL_HOST ||
      !process.env.MAIL_USER ||
      !process.env.MAIL_PASS
    ) {
      throw new Error(
        "Email configuration is incomplete. Please check SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env file"
      );
    }

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: to,
      subject: "Your OTP Code - Wave Driver",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 20px 0; text-align: center; background-color: #ffffff;">
                <h1 style="color: #333333; margin: 0;">Wave Driver</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 20px; background-color: #f4f4f4;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <h2 style="color: #333333; margin: 0 0 20px 0;">OTP Verification</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                        Your One-Time Password (OTP) for email verification is:
                      </p>
                      <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <h1 style="color: #007bff; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">
                          ${otp}
                        </h1>
                      </div>
                      <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 30px 0 0 0;">
                        This OTP will expire in <strong>10 minutes</strong>.
                      </p>
                      <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0 0;">
                        If you didn't request this OTP, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #ffffff;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Wave Driver. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Your OTP Code - Wave Driver
        
        Your One-Time Password (OTP) for email verification is: ${otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't request this OTP, please ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};


/**
 * Verify email transporter configuration
 * @returns {Promise<boolean>} - Verification result
 */
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("Email server configuration error:", error);
    return false;
  }
};



/**
 * Send booking confirmation email
 * @param {string} to - Recipient email
 * @param {Object} booking - Booking object
 * @param {Object} service - Service object
 * @param {Object} business - Business object
 * @param {Object} user - User object
 */
const sendBookingEmail = async (to, booking, service, business, user) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: to,
      subject: "Booking Confirmation - Home Glame",
      html: `
        <h2>Booking Created Successfully</h2>
        <p>Hello,</p>
        <p>A new booking has been created.</p>

        <h3>📌 Booking Details:</h3>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <p><strong>Booked At:</strong> ${booking.bookedAt}</p>

        <h3>🛠️ Service Details:</h3>
        <p><strong>Service:</strong> ${service?.name}</p>
        <p><strong>Description:</strong> ${service?.description}</p>

        <h3>🏢 Business:</h3>
        <p><strong>Business Name:</strong> ${business?.name}</p>
        <p><strong>Address:</strong> ${business?.address}</p>

        <h3>👤 User:</h3>
        <p><strong>Name:</strong> ${user?.name}</p>
        <p><strong>Email:</strong> ${user?.email}</p>

        <hr/>
        <p>This is an automated confirmation email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Email Error:", error);
  }
};


module.exports = {
  sendOTPEmail,
  verifyEmailConfig,
  transporter,
  sendBookingEmail
};
