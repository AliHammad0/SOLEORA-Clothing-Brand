
import express from "express";
import {
  signup,
  login,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controller/users.js";

import {
  verifyToken,
  verifyAdmin,
} from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);

// Admin-only routes
userRouter.get("/", verifyToken, verifyAdmin, getAllUsers);
userRouter.get("/:id", verifyToken, verifyAdmin, getSingleUser);
userRouter.put("/:id", verifyToken, verifyAdmin, updateUser);
userRouter.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default userRouter;
