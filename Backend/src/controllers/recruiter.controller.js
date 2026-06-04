const recruiterModel = require("../models/recruiter.model");
const userModel = require("../models/user.model");
const inputModel = require("../models/input.model");

async function saveAnalysis(req, res) {
  try {
    const { matchPercentage, jobTitle } = req.body;

    const user = await userModel.findById(req.user.id).select("username email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const input = await inputModel
      .findOne({ user: req.user.id })
      .sort({ createdAt: -1 });
    const resumeUrl = input?.resume || "";

    const doc = await recruiterModel.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        username: user.username,
        email: user.email,
        resumeUrl,
        matchPercentage: Math.round(matchPercentage),
        jobTitle: jobTitle || "Software Developer",
      },
      { upsert: true, new: true },
    );

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getLeaderboard(req, res) {
  try {
    const results = await recruiterModel.find().sort({ matchPercentage: -1 });

    // console.log(results);

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  saveAnalysis,
  getLeaderboard,
};
