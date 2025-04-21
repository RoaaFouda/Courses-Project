class AppError extends Error {
    constructor(){
        super();
    }

    create(message, statusCode = 500){
        this.status = "fail";
        this.message = message;
        this.statusCode = statusCode;

        return this;
    }
}

module.exports = new AppError();