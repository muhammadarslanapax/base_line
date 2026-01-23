module.exports = {
    authenticateRoutes: {
      path: [
        { url: "/auth/signup", method: "POST" },
        { url: "/auth/login", method: "POST" },
        { url: "/auth/varifyOtp", method: "POST" },
        
        { url: "/auth/socialAuth", method: "POST" },


       
        { url: "/doc", method: "GET" },
      ],
    },
  };