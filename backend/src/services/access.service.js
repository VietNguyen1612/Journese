"use strict";

const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { User, userAttribute } = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { getInfoData } = require("../utils");
const { createTokenPair } = require("../auth");
const { createKeyToken } = require("./keytoken.service");
const Block = require("../models/block.model");
const { default: axios } = require("axios");
const NotificationService = require("../services/notification.service");
const { Recommendation } = require("../models/recommendation.model");
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


class AccessService {
  static async sendOTP({ phone }) {
    const userExisted = await User.findOne({ phone });

    if (userExisted) {
      throw new BadRequestError("User already existed");
    }

    try {
      client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID)
        .verifications.create({ to: process.env.TEST_NUMBER, channel: "sms" });

      return;
    } catch (error) {
      throw new BadRequestError("OTP error");
    }
  }

  static async signUp({ phone, password, firstName, lastName, role = "user", code }) {
    const userExisted = await User.findOne({ phone });

    if (userExisted) {
      throw new BadRequestError("User already existed");
    }
    const response = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({ to: process.env.TEST_NUMBER, code: code })
      //free version of twillio only allows 1 phone number. Upgrade to premium can send sms to the phone number of the user
    if (response.status !== 'approved') {
      throw new BadRequestError("OTP is not correct");
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      phone,
      firstName,
      lastName,
      role,
      password: passwordHashed,
    });

    newUser.attributes = await userAttribute.create({ _id: newUser._id });
    await newUser.save();

    await Recommendation.create({
      userId: newUser._id,
      places: []
    })

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Keystore error");
      }
      const tokens = await createTokenPair(
        { userId: newUser._id, phone, role },
        publicKey,
        privateKey
      );
      await axios
        .post("https://exotic-filly-publicly.ngrok-free.app/users/", {
          user_id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
        })
        .then((res) => {
          console.log(res);
        });
      return {
        user: getInfoData({
          fields: ["_id", "firstName", "lastName", "avatarUrl", "phone", "isValid"],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  }

  static signIn = async ({ phone, password, expoToken }) => {
    const foundUser = await User.findOne({ phone }).lean();
    const block = await Block.findOne({ userId: foundUser._id });
    console.log(block);
    if (block) {
      throw new BadRequestError("Account has been blocked");
    }
    if (!foundUser) {
      throw new BadRequestError("User not registered");
    }
    // 2.
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) throw new AuthFailureError("Authentication Error");
    // 3.
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundUser._id, phone, role: foundUser.role },
      publicKey,
      privateKey
    );

    await createKeyToken({
      userId: foundUser._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    const res = await NotificationService.upsertUserDeviceMapping({
      userId: foundUser._id,
      expoToken,
    });
    console.log("added user device mapping ", res.receiverId);
    return {
      user: getInfoData({
        fields: ["_id", "phone", "firstName", "lastName", "avatarUrl", "isValid"],
        object: foundUser,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
