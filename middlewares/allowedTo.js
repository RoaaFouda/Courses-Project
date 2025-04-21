const AppError = require("../utils/AppError")

module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)){
            const error = AppError.create("Unauthorized user", 403);
            return next(error);
        }
        next();
    }
}