module.exports = (asyncFn) => {
    return (req, res, next) => {
        asyncFn(req, res, next).catch((err) => {
            console.log(err);
            err.message = "internal server error";
            next(err);
        });
    }
}