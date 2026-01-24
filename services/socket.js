const { Server } = require("socket.io");
const { verifyJWTToken } = require("../utils/jwtToken");

let socketIOInstance = null;

const  initializeSocket=(server)=>{
    const io =new Server(server,{
        cors: {
            origin:process.env.CORS_ORIGIN|| "*", 
            methods: ["GET", "POST"],
            credentials: true
          },
          transports: ['websocket', 'polling']
    });

    socketIOInstance = io;



     // check token
    io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
          if (!token) {
            return next(new Error("Authentication error: No token provided"));
          }
    
          const result = await verifyJWTToken(token);
          if (result.err) {
            return next(new Error("Authentication error: Invalid token"));
          }
    
          socket.user = result.decoded;
          
          next();
        } catch (error) {
          next(new Error("Authentication error: " + error.message));
        }
      });

      

      io.on("connection", async (socket) => {
        console.log(`User connected: ${socket.user.id} (Type: ${socket.user.type || 'N/A'})`);
      
        // Join room with user id
        socket.join(socket.user.id);
      });
      


    
}

const getSocketIO = () => {
    return socketIOInstance;
  };
  
  module.exports = {
    initializeSocket,
    getSocketIO
  };