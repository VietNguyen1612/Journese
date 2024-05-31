"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res) => {
    new CREATED({
      message: "Archive added successfully",
      metadata: await CommentService.createComment({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
  getCommentsByTypeId = async (req, res) => {
    new SuccessResponse({
      message: "Get comments successfully",
      metadata: await CommentService.getCommentsByTypeId(req.body),
    }).send(res);
  };
  deleteComment = async (req, res) => {
    new SuccessResponse({
      message: "Delete comment successfully",
      metadata: await CommentService.deleteComment({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new CommentController();
