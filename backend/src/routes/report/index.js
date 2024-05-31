"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const ReportController = require("../../controllers/report.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.get("/all", asyncHandler(ReportController.getAllReports));
router.get("/view", asyncHandler(ReportController.getReportDetail));

router.post("", authentication, asyncHandler(ReportController.createReport));
router.post("/response", asyncHandler(ReportController.responseReport));

module.exports = router;
