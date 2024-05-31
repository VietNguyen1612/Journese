const Block = require("../models/block.model");
const Report = require("../models/report.model");
const { Types } = require("mongoose");
const { User } = require("../models/user.model");
const Post = require("../models/post.model");
class ReportService {
  static async getReportDetail({ type, id }) {
    if (type == 'Post') {
      return await Report.findOne({ type, _id: id })
        .populate({
          path: 'targetEntityId',
          populate: {
            path: 'userId',
            model: 'User'
          }
        })
        .populate('user');
    } else if (type == 'User') {
      let report = await Report.findOne({ type, _id: id }).populate([
        "targetEntityId",
        "user",
      ]);
      // Assuming the block is related to the user
      let block = await Block.findOne({ userId: report.targetEntityId._id });
      console.log(block);

      // Convert the Mongoose document to a plain JavaScript object
      report = report.toObject();

      // Add the block property
      report.block = block;
      return report;
    }
  }

  static async getAllReports({ type }) {
    if (type === 'Post') {
      return await Report.find({ type })
        .populate({
          path: 'targetEntityId',
          populate: {
            path: 'userId',
            model: 'User'
          }
        })
        .populate('user');
    } else {
      return await Report.find({ type }).populate(["targetEntityId", "user"]);
    }
  }
  static async createReport({ user, type, targetEntityId, details, images }) {
    const report = await Report.create({
      user,
      type,
      targetEntityId: new Types.ObjectId(targetEntityId),
      details,
      images,
    });
    return await report.populate("targetEntityId");
  }
  static async responseReport({
    state,
    reportId,
    adminComment,
    reason,
  }) {
    const reportRes = await Report.findOne({ _id: reportId })
    const report = await Report.findByIdAndUpdate(reportId, {
      state,
      adminComment,
    }).lean();
    if (state == "approve") {
      if (reportRes.type == 'Post') {
        const post = await Post.findByIdAndUpdate(report.targetEntityId, {
          isDeleted: true
        })
        await Report.updateMany({ targetEntityId: new Types.ObjectId(report.targetEntityId) }, { state });
      } else if (reportRes.type == 'User') {
        // 1d = 86400s
        await Block.create({
          createdAt: new Date(),
          userId: new Types.ObjectId(report.targetEntityId),
          reason
        });
        const user = await User.findByIdAndUpdate(report.targetEntityId, {
          isBlock: true
        })
        await Report.updateMany({ targetEntityId: new Types.ObjectId(report.targetEntityId) }, { state });
      }
    }
    return report
  }
}

module.exports = ReportService;
