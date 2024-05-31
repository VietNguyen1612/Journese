"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const PostController = require("../../controllers/post.controller");
const { authentication } = require("../../auth");

const router = express.Router();
router.get("", asyncHandler(PostController.getAllPost));

router.use(authentication);

router.post("", asyncHandler(PostController.createPost));
router.get("/user", asyncHandler(PostController.getAllPostByUserId));
router.get("/:postId", asyncHandler(PostController.getPostDetail));
router.post("/like/:postId", asyncHandler(PostController.likePost));
router.patch("/:postId", asyncHandler(PostController.updatePost));
router.delete("/:postId", asyncHandler(PostController.deletePost));
module.exports = router;
