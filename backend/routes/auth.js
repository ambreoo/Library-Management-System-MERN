import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/sendMail.js";

const router = express.Router();
const API_URL = process.env.REACT_APP_FRONTEND_URL
const tokenExpireTime = 24 * 60 * 60 * 1000;

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    // const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user = req.body.admissionId
      ? await User.findOne({
          admissionId: req.body.admissionId,
        })
      : await User.findOne({
          employeeId: req.body.employeeId,
        });

    console.log(user, "user");

    !user && res.status(404).json("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(400).json("Wrong Password");

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

/* Forgot Password */
router.post("/forgot-password", async (req, res) => {
  try {
    const { admissionId, employeeId } = req.body;
    console.log("Received request to reset password for:", admissionId, employeeId);

    const user = admissionId
      ? await User.findOne({ admissionId })
      : await User.findOne({ employeeId });

    if (!user) return res.status(404).json("User not found");

    // Generate reset token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex"); // Random 32-byte token

    // Save the reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + tokenExpireTime; // 24 hours expiration
    await user.save();

    // Generate reset URL with token
    const resetUrl = API_URL+`forgot-password?token=${resetToken}`;

    // Send the reset URL to the user
    await sendMail(user.email, "Password Reset", `Click here to reset your password: ${resetUrl}`);

    res.status(200).json("Password reset link sent to your email.");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error processing password reset request.");
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user with this reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token and expiry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


export default router;
