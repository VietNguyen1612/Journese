const { Message } = require("../models/message.model")
const { User } = require("../models/user.model")
const { Types } = require("mongoose");
class MessageService {
    // Add a new message
    static async addMessage({ content, groupChatId, senderId }) {
        let newMessage = await Message.create({ content, groupChatId, senderId })
        newMessage = await newMessage.populate('senderId', "_id firstName lastName avatarUrl")
        newMessage = await newMessage.populate("groupChatId")
        newMessage = await User.populate(newMessage, {
            path: "groupChatId.participants",
            select: "_id firstName lastName avatarUrl"
        })
        return newMessage;
    }

    static async getAllMessagesByGroupChatId({ groupChatId }) {
        const messages = await Message.find({ groupChatId: groupChatId }).populate('senderId', "_id firstName lastName avatarUrl")
        return messages;
    }

}

module.exports = MessageService;