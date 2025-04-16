import mongoose from "mongoose";
import { MessageModel } from "../models/MessageModel.js";
import { User } from "../models/UserModel.js";
import { mkdirSync, renameSync } from "fs";

export const searchContacts = async (req, res) => {
  try {
    const { id } = req.user;
    const { searchTerm } = req.body;

    if (!searchTerm || !searchTerm?.trim()) {
      return res
        .status(400)
        .send({ success: false, msg: "SearchTerm is required." });
    }

    const regEx = new RegExp(searchTerm, "i");

    const users = await User.find({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ firstName: regEx }, { lastName: regEx }, { email: regEx }] },
      ],
    });

    return res.status(201).send({
      success: true,
      msg: "Contacts fetched successfully",
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const getContactsForDMList = async (req, res) => {
  try {
    const { id } = req.user;
    const userObjectId = new mongoose.Types.ObjectId(id);

    const DMList = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { recipient: userObjectId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userObjectId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          contactId: "$_id",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          email: "$contactInfo.email",
          profileImage: "$contactInfo.profileImage",
          selectedColor: "$contactInfo.selectedColor",
          lastMessageTime: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(201).send({
      success: true,
      msg: "Contacts fetched successfully",
      data: DMList,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .send({ success: false, msg: "Files are required." });
    }

    const date = Date.now();

    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(file.path, fileName);

    return res.status(201).send({
      success: true,
      msg: "File uploaded successfully",
      data: { fileUrl: fileName },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find(
      {
        _id: { $ne: req.user.id },
      },
      "_id firstName lastName"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      _id: user._id,
    }));

    return res.status(201).send({
      success: true,
      msg: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};
