const { json } = require("express");
const { CREATED, SuccessResponse } = require("../core/success.response");
const AdvertisementService = require("../services/ads.service");

class AdvertisementController {
    createAdvertisement = async (req, res) => {
        new CREATED({
            message: "Create ads successfully",
            metadata: await AdvertisementService.createAdvertisement({
                userId: req.user.userId,
                payload: req.body,
            }),
        }).send(res);
    };

    validateAdvertisement = async (req, res) => {
        new SuccessResponse({
            message: "Validate ads successfully",
            metadata: await AdvertisementService.validateAdvertisement({
                ...req.body,
            }),
        }).send(res);
    };

    handlePaymentRequest = async (req, res) => {
        new SuccessResponse({
            message: "handle ads successfully",
            metadata: await AdvertisementService.handlePaymentRequest({
                ...req.body,
            }),
        }).send(res);
    };

    handlePaymentResponse = async (req, res) => {
        await AdvertisementService.handlePaymentResponse({ ...req.query })
        return json("Thanh toán thành công!")
    };

    getAllAdvertisementsByUserId = async (req, res) => {
        new SuccessResponse({
            message: "Get all advertisements successfully",
            metadata: await AdvertisementService.getAllAdvertisementsByUserId({
                ...req.body,
                userId: req.user.userId
            })
        }).send(res);
    };

    getAllAdvertisements = async (req, res) => {
        new SuccessResponse({
            message: "Get all advertisements successfully",
            metadata: await AdvertisementService.getAllAds({ ...req.query })
        }).send(res);
    };
}

module.exports = new AdvertisementController();