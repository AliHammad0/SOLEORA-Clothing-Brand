
import jwt from "jsonwebtoken";
import * as config from "../config/config.js";
import User from "../model/users.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Authentication required",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Token is missing",
      });
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);

    if (!decoded.id) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isActive !== true) {
      return res.status(401).json({
        ok: false,
        message: "Invalid or inactive account",
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

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({
      ok: false,
      message: "Admin access required",
    });
  }

  next();
};
