
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

userRouter.get("/" , getAllUsers);
userRouter.get("/:id", getSingleUser);
userRouter.put("/:id",  updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
