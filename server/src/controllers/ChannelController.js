import mongoose from "mongoose";
import { ChannelModel } from "../models/ChannelModel.js";
import { User } from "../models/UserModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const { id } = req.user;

    if (!name || !members) {
      return res
        .status(400)
        .send({ success: false, msg: "Name and members are required" });
    }

    const admin = User.findOne({ _id: id });

    if (!admin) {
      return res.status(404).send({ success: false, msg: "Admin not found" });
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).send({ success: false, msg: "Invalid members" });
    }

    const newChannel = new ChannelModel({
      name,
      members,
      admin: id,
    });

    await newChannel.save();

    return res.status(201).send({
      success: true,
      msg: "Channel created successfully",
      data: { channel: newChannel },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const channels = await ChannelModel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).send({
      success: true,
      msg: "Channel created successfully",
      data: { channels },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await ChannelModel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id profileImage selectedColor",
      },
    });

    if (!channel) {
      return res.status(404).send({ success: false, msg: "Channel not found" });
    }

    const messages = channel.messages;

    return res.status(201).send({
      success: true,
      msg: "Channel messages found successfully",
      data: messages,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};
