const { SuccessResponse } = require("../core/success.response");
const ReportService = require("../services/report.service");
class ReportController {
  getReportDetail = async (req, res) => {
    new SuccessResponse({
      message: "",
      metadata: await ReportService.getReportDetail(req.query),
    }).send(res);
  };
  getAllReports = async (req, res) => {
    new SuccessResponse({
      message: "return sucessfully",
      metadata: await ReportService.getAllReports(req.query),
    }).send(res);
  };
  createReport = async (req, res) => {
    const user = req.user.userId;
    new SuccessResponse({
      message: "create report successfully",
      metadata: await ReportService.createReport({ user, ...req.body }),
    }).send(res);
  };
  responseReport = async (req, res) => {
    new SuccessResponse({
      message: "response report successfully",
      metadata: await ReportService.responseReport(req.body),
    }).send(res);
  };
}

module.exports = new ReportController();
