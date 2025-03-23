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

    res.cookie("jwt", token, {
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
    console.log("signUp ~ error:", error);
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

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        isSetUpComplete: user.isSetUpComplete,
      },
      process.env.JWT_KEY,
      options
    );

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "None",
    });

    return res.status(201).send({
      success: true,
      msg: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.log("signUp ~ error:", error);
    return res
      .status(500)
      .send({ success: false, msg: "Internal server error" });
  }
};
