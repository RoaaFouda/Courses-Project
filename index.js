require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer");
const db = require("./config/db");

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
const swaggerDoc = require("./utils/swagger/swaggerDoc");
swaggerDoc(app);

db();

const courseRouter = require("./routers/course.router")
const userRouter = require("./routers/user.router")

app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

app.use( (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.status || "Fail",
        message: error.message || "internal server error",
        code: error.statusCode || 500,
        data: null
    })
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listneing on port ${port}`)
})