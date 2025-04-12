import { MessageModel } from "../models/MessageModel.js";

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
