"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const ConfirmTicketController = require("../../controllers/confirm.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.get("/all", asyncHandler(ConfirmTicketController.getAll));
router.get("/:id", asyncHandler(ConfirmTicketController.getDetail));
router.post("/approved", asyncHandler(ConfirmTicketController.approvedTicket));
router.post("/reject", asyncHandler(ConfirmTicketController.rejectTicket));
router.use(authentication);
router.post(
  "/create",
  asyncHandler(ConfirmTicketController.createConfirmTicket)
);

module.exports = router;
