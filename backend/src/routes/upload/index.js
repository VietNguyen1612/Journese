"use strict";
"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth");
const UploadController = require("../../controllers/upload.controller");

const router = express.Router();

router.use(authentication);

router.post("/post/upload", asyncHandler(UploadController.uploadFile));
module.exports = router;
