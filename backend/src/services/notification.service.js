const { Notification, UserDeviceMapping } = require("../models/notification.model")
const { Types } = require("mongoose");
const { Expo } = require('expo-server-sdk')
class NotificationService {
    static async upsertUserDeviceMapping({ userId, expoToken }) {
        // Try to find an existing mapping with the same expoToken
        let mapping = await UserDeviceMapping.findOne({ expoToken });

        if (mapping) {
            // If a mapping exists, update the userId
            mapping.receiverId = new Types.ObjectId(userId);
            console.log(mapping.receiverId);
        } else {
            // If no mapping exists, create a new one
            mapping = new UserDeviceMapping({ receiverId: new Types.ObjectId(userId), expoToken });
        }

        // Save the mapping (either updated or new)
        await mapping.save();

        return mapping;
    }

    static async removeUserId({ userId, expoToken }) {
        // Try to find an existing mapping with the same expoToken
        let mapping = await UserDeviceMapping.findOne({ expoToken });
        mapping.receiverId = null
        await mapping.save();
        return mapping;
    }

    static async addNotification({ senderId, receiverId, content, title }) {
        const expo = new Expo();
        const notification = await Notification.create({
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId),
            content: content,
            title: title
        });
        const userDeviceMapping = await UserDeviceMapping.findOne({
            receiverId: new Types.ObjectId(receiverId)
        });
        if (!userDeviceMapping) {
            console.error(`No push token found for user ${receiverId}`);
            return;
        }
        // Check that the push token is valid
        if (!Expo.isExpoPushToken(userDeviceMapping.expoToken)) {
            console.error(`Push token ${userDeviceMapping.expoToken} is not a valid Expo push token`);
            return;
        }

        // Create the message
        let message = {
            to: userDeviceMapping.expoToken,
            sound: 'default',
            title: title,
            body: content,
        };

        // Send the notification
        let receipt;
        try {
            receipt = await expo.sendPushNotificationsAsync([message]);
        } catch (error) {
            console.error(`Failed to send notification: ${error}`);
            return;
        }
        return notification
    }

    static async getAllNotifications({ userId }) {
        const notifications = await Notification.find({
            receiverId: new Types.ObjectId(userId)
        }).populate('senderId')
            .populate('receiverId')
        return notifications
    }
}

module.exports = NotificationService;