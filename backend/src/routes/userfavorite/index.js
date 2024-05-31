"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const UserFavoriteController = require("../../controllers/userfavorite.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post(
  "/",
  authentication,
  asyncHandler(UserFavoriteController.addOrUpdateUserFavorites)
);
module.exports = router;
