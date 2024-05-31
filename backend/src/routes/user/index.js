"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const UserController = require("../../controllers/user.controller");
const { authentication, authorize } = require("../../auth");

const router = express.Router();
router.get("", asyncHandler(UserController.getAllUser));
router.get(
  "/admin/users/:userId",
  asyncHandler(UserController.getUserDetailInfor)
);
// /**
//  * This function comment is parsed by doctrine
//  * @route GET /api
//  * @group foo - Operations about user
//  * @param {string} userId.query.required - username or email - eg: user@domain
//  * @param {string} password.query.required - user's password.
//  * @returns {object} 200 - An array of user info
//  * @returns {Error}  default - Unexpected error
//  */

router.get("/friend", asyncHandler(UserController.getFriends));
router.get("/:userId", asyncHandler(UserController.getProfile));
router.use(authentication);
router.get("/follow/:userId", asyncHandler(UserController.getFriendAndFollow));
router.patch("/update", asyncHandler(UserController.updateUser));

// admin
// router.use(authorize("admin"));
module.exports = router;
