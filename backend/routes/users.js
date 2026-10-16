import express from "express";
import {
  signup,
  login,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controller/users.js";
import { verifyAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

// Public Authentication
userRouter.post("/signup", signup);
userRouter.post("/login", login);

// Admin Only - User Management
userRouter.get("/", verifyAdmin, getAllUsers);
userRouter.get("/:id", verifyAdmin, getSingleUser);
userRouter.put("/:id", verifyAdmin, updateUser);
userRouter.delete("/:id", verifyAdmin, deleteUser);

export default userRouter;
