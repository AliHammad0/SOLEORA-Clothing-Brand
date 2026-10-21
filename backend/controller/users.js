
import User from "../model/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as config from "../config/config.js";

const createOtp = () => crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const sendOtpEmail = async (email, otp) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "SOLEORA <onboarding@resend.dev>",
      to: [email],
      subject: "Your SOLEORA verification code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
          <h2>Welcome to SOLEORA!</h2>
          <p>Use this code to verify your email address:</p>
          <h1 style="letter-spacing:8px">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this code, you can ignore this email.</p>
        </div>
      `,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Resend email error:", result);
    throw new Error("Email could not be sent. Check Resend configuration.");
  }
};

// Signup and send OTP
export const signup = async (req, res) => {
  let user;

  try {
    const { firstname, lastname, email, password } = req.body;

    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        ok: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        ok: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser?.isEmailVerified) {
      return res.status(409).json({
        ok: false,
        message: "Email already exists. Please login.",
      });
    }

    const otp = createOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser) {
      existingUser.firstname = firstname.trim();
      existingUser.lastname = lastname.trim();
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.emailOtpHash = hashOtp(otp);
      existingUser.emailOtpExpiresAt = otpExpiresAt;
      existingUser.emailOtpAttempts = 0;

      user = await existingUser.save();
    } else {
      user = await User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        isAdmin: false,
        isEmailVerified: false,
        emailOtpHash: hashOtp(otp),
        emailOtpExpiresAt: otpExpiresAt,
        emailOtpAttempts: 0,
      });
    }

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (emailError) {
      if (!existingUser && user) {
        await User.findByIdAndDelete(user._id);
      }

      return res.status(502).json({
        ok: false,
        message: emailError.message,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Verification code sent to your email",
      email: normalizedEmail,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "Email already exists",
      });
    }

    console.error("Signup error:", error);

    return res.status(500).json({
      ok: false,
      message: "Signup failed",
    });
  }
};

// Verify email OTP
export const verifyEmail = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        ok: false,
        message: "Valid email and 6-digit OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Account not found. Please sign up again.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        ok: true,
        message: "Email is already verified. Please login.",
      });
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      return res.status(400).json({
        ok: false,
        message: "Please sign up again to request a new code",
      });
    }

    if (user.emailOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        ok: false,
        message: "OTP expired. Please sign up again to get a new code",
      });
    }

    if (user.emailOtpAttempts >= 5) {
      return res.status(429).json({
        ok: false,
        message: "Too many attempts. Please request a new code",
      });
    }

    if (hashOtp(otp) !== user.emailOtpHash) {
      user.emailOtpAttempts += 1;
      await user.save();

      return res.status(400).json({
        ok: false,
        message: "Incorrect verification code",
      });
    }

    user.isEmailVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    user.emailOtpAttempts = 0;

    await user.save();

    return res.status(200).json({
      ok: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      ok: false,
      message: "Email verification failed",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        ok: false,
        message: "Please verify your email before logging in",
        needsEmailVerification: true,
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        ok: false,
        message: "Your account is inactive",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      config.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isAdmin: user.isAdmin === true,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      ok: false,
      message: "Login failed",
    });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -emailOtpHash -emailOtpExpiresAt -emailOtpAttempts")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch users",
    });
  }
};

// Get Single User
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select(
      "-password -emailOtpHash -emailOtpExpiresAt -emailOtpAttempts"
    );

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch user",
    });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, email, isActive } = req.body;
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid user ID",
      });
    }

    const updateData = {};

    if (firstname !== undefined) {
      if (typeof firstname !== "string" || !firstname.trim()) {
        return res.status(400).json({
          ok: false,
          message: "First name cannot be empty",
        });
      }

      updateData.firstname = firstname.trim();
    }

    if (lastname !== undefined) {
      if (typeof lastname !== "string" || !lastname.trim()) {
        return res.status(400).json({
          ok: false,
          message: "Last name cannot be empty",
        });
      }

      updateData.lastname = lastname.trim();
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json({
          ok: false,
          message: "A valid email is required",
        });
      }

      updateData.email = email.toLowerCase().trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          ok: false,
          message: "isActive must be a boolean",
        });
      }

      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No valid fields provided for update",
      });
    }

    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          ok: false,
          message: "Email already exists",
        });
      }

      updateData.isEmailVerified = false;
      updateData.emailOtpHash = null;
      updateData.emailOtpExpiresAt = null;
      updateData.emailOtpAttempts = 0;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -emailOtpHash -emailOtpExpiresAt -emailOtpAttempts");

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "Email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Failed to update user",
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User deleted successfully",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to delete user",
    });
  }
};
