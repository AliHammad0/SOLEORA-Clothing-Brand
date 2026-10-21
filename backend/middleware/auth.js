import jwt from "jsonwebtoken";
import User from "../model/users.js";
import * as config from "../config/config.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(401).json({
        ok: false,
        message: "User not found or account inactive",
      });
    }

    if (user.isAdmin !== true) {
      return res.status(403).json({
        ok: false,
        message: "Admin access required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Please login to view your orders",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isActive === false) {
      return res.status(401).json({
        ok: false,
        message: "User not found or account inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};
