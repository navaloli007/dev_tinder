const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is not a valid connection request status`,
            },
        },
    },
    {
        timestamps: true,
    }
);

connectionRequestSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        const err = new Error("Cannot send connection request to yourself!");
        err.statusCode = 400;
        throw err;
    }
});

const ConnectionRequestModel = mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;