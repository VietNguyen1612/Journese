"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const UserFavoriteService = require("../services/userfavorite.service");

class UserFavoriteController {
    addOrUpdateUserFavorites = async (req, res) => {
        new SuccessResponse({
            message: "Add user favorites successfully",
            metadata: await UserFavoriteService.addOrUpdateUserFavorite({
                ...req.body,
                userId: req.headers['x-client-id']
            }),
        }).send(res);
    }
}

module.exports = new UserFavoriteController()