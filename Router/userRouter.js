const express = require("express");
const userController = require("./../Controllers/userController");

const router = express.Router();

//This sub-middleware is specific to the userRouter only and is used for "id" validation before sending the control to routes
router.param("id", userController.validateId);

router
.route("/")
.get(userController.getUsers)
.post(userController.validateFeilds, userController.postUser);//chaining multiple middlewares(like, validateFeilds, postUser... here)

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
