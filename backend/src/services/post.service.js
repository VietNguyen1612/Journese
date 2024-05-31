"use strict";
const { BadRequestError } = require("../core/error.response");
const Post = require("../models/post.model");
const { User } = require("../models/user.model");
const { findAllPost } = require("../repositories/post.repository");
class PostService {
  static async createPost({ userId, content, videos = [], images = [] }) {
    const user = User.findById(userId).lean();

    if (!user) {
      throw new BadRequestError("Error");
    }

    const post = await Post.create({ userId, content, videos, images });

    if (!post) {
      throw new BadRequestError("Error cant create post");
    }
    return post;
  }

  static async likePost({ userId, postId, type }) {
    console.log(userId, postId, type);
    if (type === 'unlike') {
      return await Post.findOneAndUpdate({ _id: postId }, {
        $pull: {
          liked: userId,
        },
      })
    } else {
      return await Post.findOneAndUpdate({ _id: postId }, {
        $addToSet: {
          liked: userId,
        },
      });
    }
  }

  static async updatePost({ userId, postId, content, images, videos }) {
    return await Post.findOneAndUpdate(
      { userId, _id: postId },
      {
        content,
        images,
        videos,
      },
      {
        new: true,
      }
    );
  }

  static async deletePost({ userId, postId }) {
    return await Post.findOneAndDelete({ userId, _id: postId }).lean();
  }

  static async getAllPost({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true, isDeleted: false },
  }) {
    return await findAllPost({
      limit,
      sort,
      page,
      filter,
    });
  }

  static async getAllPostByUserId({
    userId,
    limit = 50,
    sort = "ctime",
    page = 1,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const posts = await Post.find({ userId: userId, isPublished: true })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate({ path: "userId", select: "firstName lastName avatarUrl _id" })
      .lean();
    return posts;
  }

  static async getPostDetail({ userId, postId }) {
    return await Post.findOne({ userId, _id: postId, isPublished: true })
      .populate({ path: "userId", select: "firstName lastName avatarUrl _id" })
      .lean();
  }
}

module.exports = PostService;
