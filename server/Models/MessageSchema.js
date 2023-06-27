const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    ChatUsers: {
        type: Array,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
