const {body} = require("express-validator");
const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const { register } = require("../controllers/user.controller");

const registerValidator = () => {
    return [
        body("email")
        .custom(
            async(email) => {
                const user = await User.findOne({email: email});
                if(user){
                    throw "user already exists"
                }
            }
        )
    ]
}

const loginValidator = () => {
    return [
        body("email")
        .notEmpty(),
        body('password')
        .notEmpty()
    ]
}

module.exports = {
    registerValidator,
    loginValidator
}