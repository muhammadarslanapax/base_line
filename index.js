const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const http = require("http");

const { initializeSocket } = require("./services/socket");

// Create ONE http server
const server = http.createServer(app);

// Attach Socket.IO to this server
initializeSocket(server);

const PORT = process.env.PORT || 3000;



server.listen(PORT, () => {
  console.log(`🔥 Server + Socket.IO running on port ${PORT}`);
});
