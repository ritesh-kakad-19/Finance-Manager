const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require("express-async-handler");
const sendEmail = require('../utils/sendEmail');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/profile

// GET user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// POST /api/users/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "There is no user with that email address." });
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const message = `Your password reset OTP is: ${otp}\n\nIt is valid for 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });
    // For development, log the OTP
    console.log(`Development OTP info: ${otp}`);

    res.status(200).json({ message: "OTP sent to email!" });
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Error sending email:", error);

    return res.status(500).json({ message: "There was an error sending the email. Try again later!" });
  }
});

// POST /api/users/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "OTP is invalid or has expired" });
  }

  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

module.exports = { registerUser, loginUser ,getProfile , updateProfile, forgotPassword, resetPassword };
