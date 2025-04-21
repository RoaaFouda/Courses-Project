const mongoose = require("mongoose");

module.exports = async() => {
    try{
        await mongoose.connect(process.env.DATABASE);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}