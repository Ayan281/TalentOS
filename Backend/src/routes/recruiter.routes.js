const express = require("express")
const router = express.Router();
const recruiterController = require("../controllers/recruiter.controller");
const {authUser}= require("../middlewares/auth.middleware");
const { authAdmin } = require("../middlewares/auth.middleware");


router.post("/sendData",authUser,recruiterController.saveAnalysis );
router.get("/showData",authAdmin,recruiterController.getLeaderboard);

module.exports = router;