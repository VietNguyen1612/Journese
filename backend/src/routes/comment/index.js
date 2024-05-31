"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const CommentController = require("../../controllers/comment.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post("", asyncHandler(CommentController.getCommentsByTypeId));

router.use(authentication);
router.post("/create", asyncHandler(CommentController.createComment));
router.delete("", asyncHandler(CommentController.deleteComment));

module.exports = router;
