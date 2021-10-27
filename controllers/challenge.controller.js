require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let Challenge = require("../model/challenges.js");

module.exports.getChallenge = async (req, res, next) => {
    try {
        const challenge = await Challenge.find({ user: req.userId }, { projection: { "user": 0 } });
        return res.json({ status: true, challenge });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error!" });
        next(err.message);
    }
};

module.exports.postChallenge = async (req, res, next) => {
    const { title, description, gitLink } = req.body;
    if (!title) {
        return res
            .status(400)
            .json({ success: false, message: "Title is required!" });
    }

    if (!gitLink || gitLink.length < 7 || !gitLink.includes('.com')) {
        return res
            .status(400)
            .json({ success: false, message: "link repo is invalid!" });
    }

    try {
        const challenge = new Challenge({
            title,
            description,
            gitLink,
            user: req.userId
        });
        const newChallenge = await challenge.save();

        return res.status(201).json({ success: true, message: `Submit challenge successfully!`, challenge: newChallenge });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: "Server error!" });
        next(err.message);
    }
}

module.exports.updateChallenge = async (req, res, next) => {
    const { title, description, gitLink } = req.body;

    if (!title) {
        return res
            .status(400)
            .json({ success: false, message: "Title is required" });
    }

    if (!gitLink || gitLink.length < 7 || !gitLink.includes('.com')) {
        return res
            .status(400)
            .json({ success: false, message: "link repo is invalid!" });
    }

    try {
        let updatePost = {
            title,
            description: description ? description : '',
            gitLink,
        };

        const updateIf = { _id: req.params.id, user: req.userId };

        const updateInfo = await Challenge.findOneAndUpdate(
            updateIf,
            updatePost,
            { new: true, projection: { "user": 0 } }
        );

        if (!updateInfo) {
            return res.status(401).json({
                success: false,
                message: "Post or user not found!",
            });
        }

        res.json({
            success: true,
            message: "Updated successfully!",
            challenge: updateInfo,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
        next(err);
    }
};

module.exports.deleteChallenge = async (req, res, next) => {
    try {
        const deleteIf = { _id: req.params.id, user: req.userId };
        const deleteInfo = await Challenge.findOneAndDelete(
            deleteIf, { projection: { "user": 0 } }
        );

        if (!deleteInfo) {
            return res.status(401).json({
                success: false,
                message: "Challenge or user not found!",
            });
        }

        res.json({ success: true, challenge: deleteInfo });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
        next(err);
    }
};
