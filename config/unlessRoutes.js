module.exports = {
    authenticateRoutes: {
      path: [
        { url: "/driver/register", method: "POST" },
        // { url: "/driver/user/payment", method: "POST" },
        { url: "/driver/user/documents", method: "POST" },
        { url: "/driver/user/vehicle", method: "POST" },
        { url: "/auth", method: "POST" },
        { url: "/auth/apple-login", method: "POST" },
        { url: "/auth/phone-login", method: "POST" },
        { url: "/driver/auth", method: "POST" },
        { url: "/driver/signin", method: "POST" },
        { url: "/is-email-exist", method: "POST" },
        { url: "/is-phone-exist", method: "POST" },
        { url: "/driver/auth/is-email-exist", method: "POST" },
        { url: "/driver/auth/is-phone-exist", method: "POST" },
        { url: "/driver/auth/send-email-otp", method: "POST" },
        { url: "/driver/auth/verify-email-otp", method: "POST" },
        { url: "/doc", method: "GET" },
        // { url: "/^\/api\/v1\/test\/*/", method: "PATCH" },
      ],
    },
  };