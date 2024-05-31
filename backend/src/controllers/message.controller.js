const { Message } = require("../models/message.model.js");
const { CREATED, SuccessResponse } = require("../core/success.response");
const MessageService = require("../services/message.service");
class MessageController {
  createMessage = async (req, res) => {
    new CREATED({
      message: "Created msg successfully",
      metadata: await MessageService.addMessage({
        ...req.body,
        senderId: req.user.userId
      })
    }).send(res);
  };

  getAllMessagesByGroupChatId = async (req, res) => {
    new SuccessResponse({
      message: "Get msg successfully",
      metadata: await MessageService.getAllMessagesByGroupChatId(req.params)
    }).send(res);
  };
}



module.exports = new MessageController()
