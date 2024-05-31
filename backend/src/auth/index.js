"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { findTokenByUserId } = require("../services/keytoken.service");
const { User } = require("../models/user.model");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findById } = require("../models/keytoken.model");
const Block = require("../models/block.model");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-roptionstoken-id",
};

const createAccessToken = async (payload, publicToken) =>
  await jwt.sign(payload, publicToken, {
    expiresIn: "7 days",
  });
const createRefreshToken = async (payload, privateKey) =>
  await jwt.sign(payload, privateKey, {
    expiresIn: "14 days",
  });

// Authentication bat doi xung
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // create accessToken
    const [accessToken, refreshToken] = await Promise.all([
      createAccessToken(payload, publicKey),
      createRefreshToken(payload, privateKey),
    ]);
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify: ${err}`);
      } else {
        console.log(`decode: ${decode}`);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("CLIENT_ID missing");
  }
  const user = await User.findById(userId).lean();
  const block = await Block.findOne({ userId }).lean();
  if (block) {
    throw new AuthFailureError("You have been blocked");
  }
  if (!user) {
    throw new AuthFailureError("CLIENT_ID doesnt valid");
  }
  if (!user.isActive) {
    throw new AuthFailureError("User need to active before using the app ");
  }
  const keyStore = await findTokenByUserId(userId);
  if (!keyStore) throw new NotFoundError("Key Not Found");
  if (req.headers[HEADER.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = refreshToken;
    return next();
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("AUTHORIZATION missing");

  const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
  if (userId !== decodeUser.userId)
    throw new AuthFailureError("Invalid UserId");
  req.user = decodeUser;
  req.keyStore = keyStore;
  return next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!userId || !accessToken) {
    throw new AuthFailureError("CLIENT_ID or AUTHORIZATION missing");
  }

  const keyStore = await findTokenByUserId(userId);
  if (!keyStore) throw new NotFoundError("Key Not Found");

  const decodedUser = jwt.verify(accessToken, keyStore.publicKey);
  if (userId !== decodedUser.userId)
    throw new AuthFailureError("Invalid UserId");

  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AuthFailureError("CLIENT_ID doesn't valid");
  }
  if (user.role !== 'admin') {
    throw new AuthFailureError("User is not an admin");
  }
  req.user = user;
  return next();
});


const verifyJWT = async (accessToken, privateKey) =>
  await jwt.verify(accessToken, privateKey);

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    const validPermission = req.objectKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    return next();
  };
};
// chua can xai toi
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "forbidden error, provide API KEY",
      });
    }
    // check objKey
    const objectKey = await findById(key);
    if (!objectKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objectKey = objectKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    console.log(req.user);
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    return next();
  };
};

module.exports = {
  createTokenPair,
  verifyJWT,
  authentication,
  permissions,
  apiKey,
  authorize,
  isAdmin
};
