"use strict";

const { User } = require("../models/user.model");
const { Trip } = require("../models/trip.model");
class UserService {
  // admin
  static async getAllUser() {
    return await User.find({ role: { $eq: "user" } })
      .select({ password: 0 })
      .lean();
  }
  static async getUserDetailInfor({ userId }) {
    const tripListQuery = Trip.findOne({ userId }).lean();
    // return
    const userQuery = User.find({ _id: userId }).select({ password: 0 }).lean();
    const [tripList, userInfo] = await Promise.all([tripListQuery, userQuery]);
    return {
      user: userInfo,
      trips: tripList,
    };
  }
  // user
  static async getProfile({ userId }) {
    // TODO: lay bai post nua
    const user = await User.findById(userId).select({ password: 0 }).lean();
    return user;
  }
  static async getFriends() {
    const user = await User.find().lean();
    return user;
  }
  static async getUserFollow({ userId }) {
    const user = await User.findById(userId)
      .select({ password: 0 })
      .populate([
        {
          path: "attributes.followers",
          select: "firstName lastName avatarUrl _id",
        },
        {
          path: "attributes.friend",
          select: "firstName lastName avatarUrl _id",
        },
      ])
      .lean();
    return user;
  }

  static async updateUser({ userId, payload }) {
    const user = await User.findById(userId).lean();
    if (user.attributes.images.includes(payload.avatarUrl)) {
      const res = await User.findByIdAndUpdate(userId,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          avatarUrl: payload.avatarUrl,
        },
        { new: true }
      );
      return res;
    } else {
      const res = await User.findByIdAndUpdate(userId,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          avatarUrl: payload.avatarUrl,
          attributes: {
            ...user.attributes,
            images: [payload.avatarUrl, ...user.attributes.images],
          },
        },
        { new: true }
      );
    }
    // const res = await User.findByIdAndUpdate(userId,
    //   { ...payload },
    //   { new: true }
    // );
  }
}
module.exports = UserService;
