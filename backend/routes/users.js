import express from "express";
import {
  signup,
  login,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
} from "../controller/users.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getSingleUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;