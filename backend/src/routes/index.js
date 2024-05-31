"use strict";

const express = require("express");

const router = express.Router();

// chung nao su dung tinh nang subscription roi han xai
// router.use(apiKey);
// router.use(permissions("0000"));

// user
router.use("/v1/auth", require("./access"));
router.use("/v1/place", require("./places"));
router.use("/v1/trip", require("./trip"));
router.use("/v1/archive", require("./archive"));
router.use("/v1/comment", require("./comment"));
router.use("/v1/user", require("./user"));
router.use("/v1/friend", require("./friend"));
router.use("/v1/post", require("./post"));
router.use("/v1/upload", require("./upload"));
router.use("/v1/report", require("./report"));
router.use("/v1/tag", require("./tag"));
router.use("/v1/rating", require("./rating"));
router.use("/v1/message", require("./message"));
router.use("/v1/groupchat", require("./groupchat"));
router.use("/v1/userfavorite", require("./userfavorite"));
router.use("/v1/confirm", require("./confirm"));

router.use("/v1/notification", require("./notification"));
router.use("/v1/ads", require("./ads"));
module.exports = router;
