"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const PostService = require("../services/post.service");

class PostController {
  getAllPost = async (req, res) => {
    console.log(req.query);
    new SuccessResponse({
      message: "Get all post successfully",
      metadata: await PostService.getAllPost(req.query),
    }).send(res);
  };
  getAllPostByUserId = async (req, res) => {
    new SuccessResponse({
      message: "Get all post by user id successfully",
      metadata: await PostService.getAllPostByUserId({
        userId: req.user.userId,
        ...req.query,
      }),
    }).send(res);
  };
  getPostDetail = async (req, res) => {
    new SuccessResponse({
      message: "Get post detail successfully",
      metadata: await PostService.getPostDetail({
        userId: req.user.userId,
        postId: req.params.postId,
      }),
    }).send(res);
  };
  createPost = async (req, res) => {
    new CREATED({
      message: "Create post successfully",
      metadata: await PostService.createPost({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
  likePost = async (req, res) => {
    new SuccessResponse({
      message: "Like post successfully",
      metadata: await PostService.likePost({
        userId: req.user.userId,
        postId: req.params.postId,
        type: req.body.type,
      }),
    }).send(res);
  }
  updatePost = async (req, res) => {
    new SuccessResponse({
      message: "Update post successfully",
      metadata: await PostService.updatePost({
        userId: req.user.userId,
        postId: req.params.postId,
        ...req.body,
      }),
    }).send(res);
  };
  deletePost = async (req, res) => {
    new SuccessResponse({
      message: "Delete post successfully",
      metadata: await PostService.deletePost({
        userId: req.user.userId,
        postId: req.params.postId,
      }),
    }).send(res);
  };
}

module.exports = new PostController();
