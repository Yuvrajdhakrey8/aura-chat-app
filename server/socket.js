import { Server as SocketIoServer } from "socket.io";
import { ChannelModel } from "./src/models/ChannelModel.js";
import { MessageModel } from "./src/models/MessageModel.js";

let io;

const setupSocket = (server) => {
  io = new SocketIoServer(server, {
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

  const deleteMessage = async ({ messageId }) => {
    try {
      const message = await MessageModel.findById(messageId);

      if (!message) return;

      // Delete attached file if it's a file-type message
      if (message.messageType === "file" && message.fileUrl) {
        try {
          const fullPath = path.resolve(message.fileUrl);
          unlinkSync(fullPath);
        } catch (err) {
          console.warn("Failed to delete file from disk:", err.message);
        }
      }

      await MessageModel.findByIdAndDelete(messageId);

      const payload = {
        messageId,
        chatId: message.recipient || message.channelId || null,
      };

      // For channel messages
      if (!message.recipient && message.channelId) {
        const channel = await ChannelModel.findById(message.channelId).populate(
          "members"
        );
        if (channel) {
          channel.members.forEach((member) => {
            const memberSocketId = userSocketMap.get(member._id.toString());
            if (memberSocketId) {
              io.to(memberSocketId).emit("messageDeleted", payload);
            }
          });

          // Emit to channel admin too
          const adminSocketId = userSocketMap.get(channel.admin.toString());
          if (adminSocketId) {
            io.to(adminSocketId).emit("messageDeleted", payload);
          }
        }
      }

      // For private messages
      if (message.recipient) {
        const senderSocketId = userSocketMap.get(message.sender.toString());
        const recipientSocketId = userSocketMap.get(
          message.recipient.toString()
        );

        if (senderSocketId) {
          io.to(senderSocketId).emit("messageDeleted", payload);
        }
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("messageDeleted", payload);
        }
      }
    } catch (err) {
      console.error("Error deleting message:", err.message);
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
    socket.on("deleteMessage", deleteMessage);
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

export { io };
