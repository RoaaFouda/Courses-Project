const express = require("express");
const { register, login, getAllUsers, getToken, logout } = require("../controllers/user.controller");
const { registerValidator, loginValidator } = require("../middlewares/userValidator");
const multer = require("multer");
const verifyToken = require("../middlewares/verifyToken");
const AppError = require("../utils/AppError");

const router = express.Router();

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
                cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
                const ext = file.mimetype.split('/')[1];
                const fileName = `user-${Date.now()}.${ext}`;
                cb(null, fileName);
        }
})

const fileFilter = (req, file, cb) => {
        const imageType = file.mimetype.split('/')[0];
        
        if(imageType === 'image') {
            return cb(null, true)
        } else {
            return cb(AppError.create('file must be an image', 400), false)
        }
}
      
const upload = multer({ 
        storage,
        fileFilter
 })



router.route("/register")
        .post(upload.single('avatar'), registerValidator(), register)

router.route("/login")
        .post(loginValidator(), login)

router.route("/")
        .get(verifyToken,getAllUsers)

router.route("/token")
        .post(getToken)

router.route("/logout")
        .get(logout)

module.exports = router;