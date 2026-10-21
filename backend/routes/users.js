
import express from "express";
import {
  signup,
  verifyEmail,
  login,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controller/users.js";
import { verifyAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/login", login);

userRouter.get("/", verifyAdmin, getAllUsers);
userRouter.get("/:id", verifyAdmin, getSingleUser);
userRouter.put("/:id", verifyAdmin, updateUser);
userRouter.delete("/:id", verifyAdmin, deleteUser);

export default userRouter;
