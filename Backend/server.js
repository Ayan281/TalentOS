require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const authSocket = require("./src/middlewares/authSocket");
const chatHandler = require("./src/socket/chatHandler");

connectDB();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL, 
    credentials: true,
  }
});

io.use(authSocket);

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);
  console.log("👤 User:", socket.user);
  chatHandler(io, socket);
});

httpServer.listen(process.env.PORT || 5000, () => {
  console.log("Server Started...");
});