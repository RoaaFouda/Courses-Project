const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError")

module.exports = (req, res, next) => {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if(!authHeader) {
        const error = AppError.create('token is required', 401)
        return next(error);
    }

    const token = authHeader.split(" ")[1];
    try {

        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();

    } catch (err) {
        console.log(err)
        const error = AppError.create('invalid token', 401)
        return next(error);
    }   
    
}