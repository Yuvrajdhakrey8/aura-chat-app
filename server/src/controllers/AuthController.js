import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

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
    const { firstName, lastName, selectedColor, profileImage } = req.body;

    if (!firstName || !lastName || !selectedColor) {
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

    await User.updateOne(
      { _id: id },
      {
        $set: {
          firstName,
          lastName,
          selectedColor,
          isSetUpComplete: true,
        },
      },
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
