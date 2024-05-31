const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const MessageController = require("../../controllers/message.controller");
const { authentication } = require("../../auth");

const router = express.Router();

router.post("/", authentication, asyncHandler(MessageController.createMessage));
router.get("/:groupChatId", asyncHandler(MessageController.getAllMessagesByGroupChatId));
module.exports = router