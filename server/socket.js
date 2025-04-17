import { Server as SocketIoServer } from "socket.io";
import { MessageModel } from "./src/models/MessageModel.js";
import { ChannelModel } from "./src/models/ChannelModel.js";

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

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await MessageModel.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
    });

    const messageData = await MessageModel.findById(createdMessage._id)
      .populate("sender", "_id firstName lastName profileImage selectedColor")
      .exec();

    await ChannelModel.findByIdAndUpdate(
      channelId,
      { $push: { messages: createdMessage._id } },
      { new: true }
    );

    const channel = await ChannelModel.findById(channelId)
      .populate("members", "_id firstName lastName profileImage selectedColor")
      .exec();

    const finalData = { ...messageData._doc, channelId: channelId };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
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
    socket.on("send-channel-message", sendChannelMessage);

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
