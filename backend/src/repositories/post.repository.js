"use strict";

const Post = require("../models/post.model");
const { getSelectData } = require("../utils");

const findPostById = async (id) => await Post.findById(id).lean();

const findAllPost = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const posts = await Post.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .populate({ path: "userId", select: "firstName lastName avatarUrl _id" })
    .lean();
  return posts;
};

module.exports = {
  findPostById,
  findAllPost,
};
