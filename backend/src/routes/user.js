const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

userRouter.get("/users/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId", USER_SAFE_DATA);

        res.json({ message: "Data fetched successfully", data: connectionRequests });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});

userRouter.get("/users/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connections.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ message: "Data fetched successfully", data: data });
    } catch (error) {
        res.status(400).send({ message: "Error" + error.message });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50);
        const skip = (page - 1) * limit;

        // all connections request sent/recieve by the user.
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");
        // find the unique user
        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({ message: "Feed fetched Successfully", data: users });
    }
    catch (err) {
        res.status(400).json({ message: "Error " + err.message });
    }
});

module.exports = userRouter;