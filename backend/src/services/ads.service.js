const { Advertisement } = require("../models/ads.model");
const { User } = require("../models/user.model");
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment');
const axios = require('axios').default;
const { Types } = require("mongoose");
const NotificationService = require("./notification.service");
class AdvertisementService {
    static async createAdvertisement({ userId, payload }) {
        const advertisement = await Advertisement.create({
            userId,
            price: payload.price,
            image: payload.image,
        });
        return advertisement;
    }
    static async validateAdvertisement({ advertisementId, isValid, msg }) {
        const advertisement = await Advertisement.findById(advertisementId);

        if (!advertisement) {
            throw new Error('Advertisement not found');
        }

        if (isValid == true) {
            advertisement.isValid = isValid;
            advertisement.validatedAt = Date.now();

            await advertisement.save();

            return advertisement;
        }
        if (isValid == false) {
            const receiver = await User.findById(new Types.ObjectId(advertisement.userId));
            const notiRes = await NotificationService.addNotification({
                senderId: null,
                receiverId: receiver._id,
                title: "Quảng cáo bị từ chối",
                content: msg,
            });
            const res = await Advertisement.findByIdAndDelete(advertisementId)

            return res
        }

    }

    static async handlePaymentRequest({ advertisementId }) {
        const advertisement = await Advertisement.findById(advertisementId);

        if (!advertisement) {
            throw new Error('Advertisement not found');
        }
        const user = await User.findById(advertisement.userId)

        const config = {
            app_id: "2553",
            key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
            key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
            endpoint: "https://sb-openapi.zalopay.vn/v2/create"
        };

        const embed_data = {
            "id": advertisementId,
            "redirecturl": `http://localhost:3056/api/v1/ads/response?id=${advertisementId}`
        };

        const items = [{}];
        // const transID = Math.floor(Math.random() * 1000000);
        const transID = new Date().getTime()
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: `${user.firstName} ${user.lastName}`,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: 50000,
            // callback_url: "http://localhost:3056/api/v1/ads/reponse",
            description: `Journese - Payment for the order #${transID}`,
            bank_code: "",
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const res = await axios.post(config.endpoint, null, { params: order });
        return res.data
    }

    static async handlePaymentResponse({ id }) {
        console.log('id', id)
        const advertisement = await Advertisement.findById(id);
        if (!advertisement) {
            throw new Error('Advertisement not found');
        }
        advertisement.isPaid = true
        advertisement.isExpired = false
        advertisement.paidAt = Date.now();
        await advertisement.save()
        return advertisement
    }

    static async getAllAdvertisementsByUserId({ isValid, isPaid, isExpired, userId }) {

        const advertisements = await Advertisement.find({
            isValid: isValid,
            isPaid: isPaid,
            isExpired: isExpired,
            userId: new Types.ObjectId(userId)
        });

        return advertisements;
    }

    static async getAllAds({ isValid, isPaid, isExpired }) {
        console.log('isValid', isValid);
        console.log('isPaid', isPaid);
        console.log('isExpired', isExpired);
        if (isValid === undefined && isPaid === undefined && isExpired === undefined) {
            const advertisements = await Advertisement.find().populate('userId').exec()
            console.log(advertisements)
            return advertisements
        } else {
            const advertisements = await Advertisement.find(
                {
                    isValid: isValid,
                    isPaid: isPaid,
                    isExpired: isExpired
                }
            ).populate('userId').exec()
            return advertisements
        }

    }
}

module.exports = AdvertisementService