const { GroupChat } = require("../models/groupchat.model")
const { Types } = require("mongoose");
const { User } = require("../models/user.model")
const { Message } = require("../models/message.model")
const MessageService = require("./message.service")
const NotificationService = require("../services/notification.service");
class GroupChatService {
    // Add a new message
    static async addGroupChat({ createdBy, name, participants, isGroupGroupChat, tripId }) {
        if (name === undefined) name = null
        if (tripId === undefined) tripId = null
        if (createdBy === undefined) createdBy = null
        if (createdBy && !participants.includes(createdBy)) {
            participants.push(createdBy);
        }
        participants = participants.map(participant => new Types.ObjectId(participant));
        if (!isGroupGroupChat) {
            const groupChat = await GroupChat.findOne({ participants: { $all: participants, $size: participants.length } });
            if (groupChat) {
                return groupChat;
            }
        }
        const newGroupChat = await GroupChat.create({
            createdBy: createdBy,
            participants: participants,
            isGroupGroupChat: isGroupGroupChat,
            name: name,
            tripId: tripId
        });
        if (createdBy !== null && isGroupGroupChat === true) {
            const user = await User.findById(createdBy);
            await MessageService.addMessage({ content: `${user.fullName} created the group chat`, groupChatId: newGroupChat._id, senderId: createdBy });
        }
        if (isGroupGroupChat === false) {
            const user1 = await User.findById(participants[0]);
            const user2 = await User.findById(participants[1]);
            await MessageService.addMessage({ content: `${user1.fullName} and ${user2.fullName} are now friends`, groupChatId: newGroupChat._id, senderId: participants[1] });
        }
        return newGroupChat;
    }

    static async getParticipantsByGroupChatId({ groupId }) {
        const groupChat = await GroupChat.findById(
            new Types.ObjectId(groupId)
        ).populate('participants');
        return groupChat
    }

    static async getAllGroupChatsByUserId(userId) {
        const groupChats = await GroupChat.aggregate([
            { $match: { participants: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "Users",
                    localField: 'participants',
                    foreignField: '_id',
                    as: 'participants'
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $project: {
                    createdBy: { $arrayElemAt: ['$createdBy', 0] },
                    name: 1,
                    isGroupGroupChat: 1,
                    tripId: 1,
                    participants: {
                        $map: {
                            input: "$participants",
                            as: "participant",
                            in: {
                                _id: "$$participant._id",
                                firstName: "$$participant.firstName",
                                lastName: "$$participant.lastName",
                                avatarUrl: "$$participant.avatarUrl"
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "Messages",
                    let: { groupChatId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$groupChatId', '$$groupChatId'] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: "Users",
                                localField: 'senderId',
                                foreignField: '_id',
                                as: 'sender'
                            }
                        },
                        { $unwind: '$sender' },
                        {
                            $project: {
                                senderId: '$sender._id',
                                avatarUrl: '$sender.avatarUrl',
                                senderName: { $concat: ['$sender.firstName', ' ', '$sender.lastName'] },
                                createdAt: 1,
                                content: 1
                            }
                        }
                    ],
                    as: 'lastMessage'
                }
            },
            { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
            { $sort: { 'lastMessage.createdAt': -1 } } // Sort by the newest message
        ]);
        return groupChats;
    }

    // Remove a user from a group chat
    static async removeUserFromGroupChat({ ownerId, groupChatId, userId }) {
        // Find the group chat
        const groupChat = await GroupChat.findById(new Types.ObjectId(groupChatId));
        if (!groupChat) {
            throw new Error('Group chat not found');
        }

        // Check if the user is the owner
        if (groupChat.createdBy.toString() !== ownerId) {
            throw new Error('Not the owner of this group chat');
        }

        if (groupChat.createdBy.toString() === userId) {
            throw new Error('Can not remove owner from groupchat');
        }

        // Check if the user is a participant
        const userIndex = groupChat.participants.indexOf(new Types.ObjectId(userId));
        if (userIndex === -1) {
            throw new Error('User is not a participant in this group chat');
        }

        // Remove the user from the participants array
        groupChat.participants.splice(userIndex, 1);

        // Save the group chat
        const updatedGroupChat = await groupChat.save();
        const sender = await User.findById(new Types.ObjectId(ownerId))
        const receiver = await User.findById(new Types.ObjectId(userId))
        const res = await NotificationService.addNotification({
            senderId: ownerId,
            receiverId: userId,
            title: groupChat.name,
            content: `${sender.fullName} đã xoá bạn khỏi nhóm chat`
        })
        console.log('sent noti', res)
        return updatedGroupChat;
    }
    // Add a user to a group chat
    static async addUserToGroupChat({ ownerId, groupChatId, userId }) {
        // Find the group chat
        const groupChat = await GroupChat.findById(new Types.ObjectId(groupChatId));
        if (!groupChat) {
            throw new Error('Group chat not found');
        }

        // Check if the user is the owner
        if (groupChat.createdBy.toString() !== ownerId) {
            throw new Error('Not the owner of this group chat');
        }

        // Check if the user is already a participant
        const userIndex = groupChat.participants.indexOf(new Types.ObjectId(userId));
        if (userIndex !== -1) {
            throw new Error('User is already a participant in this group chat');
        }

        // Add the user to the participants array
        groupChat.participants.push(new Types.ObjectId(userId));

        // Save the group chat
        const updatedGroupChat = await groupChat.save();

        return updatedGroupChat;
    }

}
module.exports = GroupChatService;