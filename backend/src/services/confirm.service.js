"use strict";

const { Confirm } = require("../models/confirm.model");
const { userAttribute, User } = require("../models/user.model");

class ConfirmTicketService {
  static async getAll() {
    return await Confirm.find().lean();
  }
  static async getDetail({ id }) {
    const res = await Confirm.findById(id)
    console.log(res.status)
    return res
  }
  static async createConfirmTicket({
    user,
    citizen_images,
    ...payload
  }) {
    const userConfirm = await User.findById(user).lean();
    await Confirm.create({
      citizen_images,
      user: userConfirm._id,
      avatarUrl: userConfirm.avatarUrl,
      firstName: userConfirm.firstName,
      lastName: userConfirm.lastName,
      phone: userConfirm.phone,
      ...payload,
    });
    await userAttribute.findByIdAndUpdate(user, {
      citizen_images,
    });
    return "Successfully";
  }
  static async approvedConfirmTicket({ id }) {
    const ticket = await Confirm.findByIdAndUpdate(id, {
      status: "approved",
    }).lean();
    const user = await User.findById(ticket.user._id).lean();
    const res = await User.findByIdAndUpdate(ticket.user, {
      isValid: true,
      attributes: {
        ...user.attributes,
        images: [ticket.citizen_images[1], ...user.attributes.images],
      },
    });
    await Confirm.findByIdAndUpdate(id, {
      // avatarUrl: res.avatarUrl,
      firstName: res.firstName,
      lastName: res.lastName,
      citizen_id: res.attributes.citizen_id
    }).lean();
    return "Successfully";
  }
  static async rejectConfirmTicket({ id }) {
    const ticket = await Confirm.findByIdAndUpdate(id, {
      status: "rejected",
    }).lean();
    return "Successfully";
  }
}

module.exports = ConfirmTicketService;
