import { unlinkSync } from "fs";
import path from "path";
import { MessageModel } from "../models/MessageModel.js";
import { io } from "../../socket.js";

export const getMessages = async (req, res) => {
  try {
    const { id } = req.user;
    const { contactId } = req.body;

    if (!contactId) {
      return res
        .status(400)
        .send({ success: false, msg: "Contact ID is required." });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: id, recipient: contactId },
        { recipient: id, sender: contactId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(201).send({
      success: true,
      msg: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { id: userId } = req.user;

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .send({ success: false, msg: "Message not found." });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }

    if (message.messageType === "file" && message.fileUrl) {
      try {
        const fullPath = path.resolve(message.fileUrl);
        unlinkSync(fullPath);
      } catch (err) {
        console.warn("Failed to delete file from disk:", err.message);
      }
    }

    await MessageModel.findByIdAndDelete(messageId);

    io.emit("messageDeleted", { messageId });

    return res.status(200).send({ success: true, msg: "Message deleted." });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};
