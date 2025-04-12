import { Server as SocketIoServer } from "socket.io";
import { MessageModel } from "./src/models/MessageModel.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await MessageModel.create(message);

    const messageData = await MessageModel.findById(createdMessage._id)
      .populate("sender", "_id firstName lastName profileImage selectedColor")
      .populate(
        "recipient",
        "_id firstName lastName profileImage selectedColor"
      );

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during the connection.");
    }

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", () => {
      console.log(`Client Disconnected: ${socket.id}`);
      for (const [uid, sid] of userSocketMap.entries()) {
        if (sid === socket.id) {
          userSocketMap.delete(uid);
          break;
        }
      }
    });
  });
};

export default setupSocket;
