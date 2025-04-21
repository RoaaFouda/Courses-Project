const mongoose = require("mongoose");
const {isEmail} = require("validator");
const userRoles = require("../utils/userRole");

const userSchema = new mongoose.Schema( {
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "field must be a valid email."]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
        default: userRoles.USER
    },
    avatar: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema);