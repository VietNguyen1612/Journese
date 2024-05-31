"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { Comment } = require("../models/comment.model");
const { findPlaceById } = require("../repositories/place.repository");
const { findPostById } = require("../repositories/post.repository");
const { convertObjectId } = require("../utils");

class CommentService {
  static async createComment({
    typeId,
    userId,
    content,
    type,
    parentId = null,
  }) {
    const comment = new Comment({
      type,
      userId,
      content,
      parentId,
      entityId: convertObjectId(typeId),
    });
    let rightValue;
    if (parentId) {
      // reply comment
      // xac dinh comment parent
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) throw new BadRequestError("Parent comment not found");

      rightValue = parentComment.right;

      await Comment.updateMany(
        {
          entityId: typeId,
          right: { $gte: rightValue },
        },
        {
          $inc: { right: 2 },
        }
      );
      await Comment.updateMany(
        {
          entityId: typeId,
          left: { $gt: rightValue },
        },
        {
          $inc: { left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          entityId: convertObjectId(typeId),
        },
        "right",
        { sort: { right: -1 } }
      ).lean();

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1; // ben phai
      } else {
        rightValue = 1; // node dau tien
      }
    }
    // node dau tien la 1 2
    comment.left = rightValue;
    comment.right = rightValue + 1;
    await comment.save();

    return comment;
  }
  static async getCommentsByTypeId({
    typeId,
    parentId = null,
    // limit = 50,
    // offset = 0, // skip
  }) {
    if (parentId) {
      const parent = await Comment.findById(parentId).lean();
      if (!parent) {
        throw new NotFoundError("Not found comment");
      }
      const comments = await Comment.find({
        entityId: typeId,
        left: { $gt: parent.left },
        right: { $lt: parent.right },
      })
        .sort({
          createdAt: 1,
        })
        .populate({
          path: "userId",
          select: "_id firstName lastName avatarUrl",
        });
      return comments;
    }

    const comments = await Comment.find({
      entityId: typeId,
      parentId: parentId,
    })
      .sort({
        createdAt: 1,
      })
      .populate({
        path: "userId",
        select: "_id firstName lastName avatarUrl",
      });
    return comments;
  }
  static async deleteComment({ commentId, userId, typeId, type }) {
    if (type === "Place") {
      const foundPlace = await findPlaceById(typeId);
      if (!foundPlace) {
        throw new BadRequestError("Place not found");
      }
    } else {
      const foundPost = await findPostById(typeId);
      if (!foundPost) {
        throw new BadRequestError("Post not found");
      }
    }

    const comment = await Comment.findOne({ _id: commentId, userId });

    const leftValue = comment.left;
    const rightValue = comment.right;

    const width = leftValue - rightValue + 1;
    // xoa tat ca id con
    await Comment.deleteMany({
      entityId: typeId,
      left: { $gte: leftValue, $lte: rightValue },
    });
    // cap nhat
    await Comment.updateMany(
      {
        entityId: typeId,
        right: { $gt: rightValue },
      },
      {
        $inc: { right: -width },
      }
    );
    await Comment.updateMany(
      {
        entityId: typeId,
        left: { $gt: rightValue },
      },
      {
        $inc: { left: -width },
      }
    );
  }
}

module.exports = CommentService;
