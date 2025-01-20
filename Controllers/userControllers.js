const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const emailTemplate = require("../emailTemplate.js");
const registerTemplate = require("../registerTemplate.js");
const resetTemplate = require("../resetTemplate.js");

// create user
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const passwordStrengthRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordStrengthRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter,one lowercase letter,one number,and one speacial character",
      });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ error: "Phone number must be exactly 10 digits long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });
    const savedUser = await newUser.save();
    console.log("User created successfully", savedUser);
    // configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // For Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to ShazzyTech!",
      html: registerTemplate(fullName),
    };
    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create the user" });
  }
};
// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill out all the details" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({ message: "Login successful", token, user: user._id });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
};
const forgotpass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();
    console.log("Sending email with OTP:", otp);
    const emailContent = emailTemplate(otp);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "OTP for Verification",
      html: emailContent, // Use the generated email template
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtpForgot = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ error: "OTP and email are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "No user found with this email" });
    }
    console.log("User found:", user);
    if (!user.otp) {
      return res.status(400).json({ error: "OTP not generated or expired" });
    }

    console.log("Stored OTP:", user.otp);
    console.log("Stored OTP Expires:", user.otpExpires);
    const currentTime = new Date();
    if (user.otpExpires < currentTime) {
      return res.status(400).json({ error: "OTP has expired" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if password length is exactly 8 characters
    if (password.length !== 8) {
      return res
        .status(400)
        .json({ error: "Password must be exactly 8 characters long" });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm Password must match" });
    }

    // Password regex: at least one uppercase, one lowercase, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, and one special character (@, $, !, %, *, ?, &, etc.)",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Hash the password and update the user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Notify user via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const fullName = user.fullName || "User";
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password",
      html: resetTemplate(fullName),
    };
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({
        message: "Password reset successfully and confirmation email sent",
      });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotpass,
  verifyOtpForgot,
  resetPassword,
};
