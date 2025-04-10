import { User } from "../models/UserModel.js";

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
