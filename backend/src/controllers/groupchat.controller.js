const { GroupChat } = require("../models/groupchat.model.js");
const { CREATED, SuccessResponse } = require("../core/success.response");
const GroupChatService = require("../services/groupchat.service");
class GroupChatController {
    createGroupChat = async (req, res) => {
        new CREATED({
            message: "Created groupchat successfully",
            metadata: await GroupChatService.addGroupChat({
                ...req.body,
                createdBy: req.user.userId
            })
        }).send(res);
    };
    getAllParticipants = async (req, res) => {
        new SuccessResponse({
            message: "Get all participants successfully",
            metadata: await GroupChatService.getParticipantsByGroupChatId(req.params)
        }).send(res);
    }
    getAllGroupChatByUserId = async (req, res) => {
        new SuccessResponse({
            message: "Get all groupchat successfully",
            metadata: await GroupChatService.getAllGroupChatsByUserId(req.user.userId)
        }).send(res);
    };
    removeUserFromGroupChat = async (req, res) => {
        new SuccessResponse({
            message: "Remove user successfully",
            metadata: await GroupChatService.removeUserFromGroupChat({
                ...req.body,
                ownerId: req.user.userId
            })
        }).send(res);
    };
    addUserToGroupChat = async (req, res) => {
        new SuccessResponse({
            message: "Add user successfully",
            metadata: await GroupChatService.addUserToGroupChat({
                ...req.body,
                ownerId: req.user.userId
            })
        }).send(res);
    };
}



module.exports = new GroupChatController()
