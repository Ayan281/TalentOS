const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");

const { authUser } = require("../middlewares/auth.middleware");

const { inputupload } = require("../controllers/input.controller");
const { getinput}= require("../controllers/input.controller");

router.post("/uploadResume", authUser, upload.single("resume"), inputupload);
router.get("/getinput", authUser, getinput)

module.exports = router;
