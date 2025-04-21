const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Token', tokenSchema);