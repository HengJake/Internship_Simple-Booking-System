import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error in fetching user : ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createUser = async (req, res) => {
  const user = req.body;

  if (!user.name || !user.email || !user.password) {
    return res.status(404).json({
      success: false,
      message: "Please provide all fields",
      data: "",
    });
  }

  try {
    const name = user.name;
    const email = user.email;

    // make sure it's all UNIQUE
    const existingUser = await User.findOne({
      $or: [{ name }, { email }],
    });

    if (existingUser) {
      const conflictField = existingUser.name === name ? "name" : "email";
      return res.status(404).json({
        success: false,
        message: `User with this ${conflictField} already exists`,
        data: "",
      });
    }

    const newUser = new User(user);
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error in create user : ", error.message);
    res.status(500).json({ success: false, message: "Server Error", data: "" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const name = user.name;
  const email = user.email;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid user ID" });
  }

  try {
    // Check for duplicate name (exclude current user)
    const existingName = await User.findOne({ name, _id: { $ne: id } });
    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Name is already in use by another user",
      });
    }

    // Check for duplicate email (exclude current user)
    const existingEmail = await User.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use by another user",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.log("Error in updating user : ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("Error in deleting user : ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =============== Utility function ===============

export const loginUser = async (req, res) => {
  const user = req.body;

  // Find user
  const checkedUser = await User.findOne({ email: user.email });

  if (!checkedUser) {
    return res
      .status(401)
      .json({ success: false, message: "Email not found", data: "" });
  }

  // Compare passwords directly
  if (checkedUser.password !== user.password) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect password", data: "" });
  }

  res.json({
    success: true,
    message: `Welcome back ${checkedUser.name}`,
    data: checkedUser,
  });
};

export const fetchUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in fetching user:", error.message);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};
