"use strict";
const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

router.post("/user/sendOTP", asyncHandler(AccessController.sendOTP));
router.post("/user/signup", asyncHandler(AccessController.signUp));
router.post("/user/signin", asyncHandler(AccessController.signIn));

module.exports = router;
