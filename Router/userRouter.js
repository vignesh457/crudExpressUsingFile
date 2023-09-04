const express = require("express");
const {
  getUsers,
  getUserById,
  postUserById,
  updateUserById,
  deleteUserById,
} = require("./../Controllers/userController");

const userRouter = express.Router();

userRouter.route("/").get(getUsers).post(postUserById);
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = userRouter;
