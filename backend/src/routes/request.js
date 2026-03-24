const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedSTatus = ["ignored", "interested"];

        if (!allowedSTatus.includes(status)) {
            return res.status(400).json({ error: "Invalid status type :" + status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });
        if (existingRequest) {
            return res.status(400).json({ error: "Connection request already sent to this user!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({ message: req.user.firstName + " is " + status + " in " + toUser.firstName, data });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedSTatus = ["accepted", "rejected"];
        if (!allowedSTatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type :" + status });
        }

        const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggedInUser._id, status: "interested" });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found!" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + status, data });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = requestRouter;
