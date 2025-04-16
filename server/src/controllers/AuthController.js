import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  expiresIn: 1 * 24 * 60 * 60 * 1000,
};

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, msg: "Email and password are required" });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).send({
        success: false,
        msg: "User with the same email already exists",
      });
    }

    const user = new User({
      email,
      password,
    });

    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_KEY, options);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "None",
    });

    return res.status(201).send({
      success: true,
      msg: "User created successfully. Please login now",
      data: savedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        msg: "User not found",
      });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({
        success: false,
        msg: "Incorrect pasword",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, options);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "None",
    });

    return res.status(201).send({
      success: true,
      msg: "Logged in successfully",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      msg: "User info fetched successfully",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const userData = JSON.parse(req.body.data);
    const { firstName, lastName, selectedColor, deleteProfileImage } = userData;
    const profileImage = req.file?.path.replace(/\\/g, "/");

    if (
      !firstName ||
      !lastName ||
      selectedColor === undefined ||
      selectedColor === null
    ) {
      return res.status(400).send({
        success: false,
        msg: "First Name, Last Name, and Color selection is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        success: false,
        msg: "User not found",
      });
    }

    const updateFields = {
      firstName,
      lastName,
      selectedColor,
      isSetUpComplete: true,
    };

    if (deleteProfileImage && user.profileImage) {
      const fsPath = path.join(
        __dirname,
        "..",
        "..",
        "uploads/profiles",
        path.basename(user.profileImage)
      );

      fs.access(fsPath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(fsPath, (err) => {
            if (err) console.error("❌ Failed to delete profile image:", err);
            else console.log("✅ Profile image deleted:", fsPath);
          });
        } else {
          console.warn("⚠️ File does not exist, cannot delete:", fsPath);
        }
      });

      updateFields.profileImage = "";
    }

    if (profileImage) {
      updateFields.profileImage = profileImage;
    }

    await User.updateOne(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    const updatedUser = await User.findById(id);

    return res.status(200).send({
      success: true,
      msg: "User info updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};

export const logOutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).send({
      success: true,
      msg: "User logout successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};
