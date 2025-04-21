const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const success = require("../utils/success");
const asyncWrapper = require("../middlewares/asyncWrapper");
const {
    createRefreshToken,
    createToken
} = require("../utils/generateJWT");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token.model");

const getAllUsers = asyncWrapper(async (req,res) => {

    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, {"__v": false, 'password': false}).limit(limit).skip(skip);
    res.json(success(users));
})


const register = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = AppError.create(errors.array(), 400);
        return next(error);
    }

    const {firstname, lastname, email, password, role} = req.body;

    if (!password) {
        const error = AppError.create("Password is required", 400);
        console.log(req.body, req.file)
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User(
        {
            firstname, 
            lastname,
            email,
            password: hashedPassword,
            role,
        }
    )

    if(req.file){
        user.avatar = req.file.filename;
    }

    await user.save();

    const token = await createToken({email: user.email, id: user._id, role: user.role});
    const refreshToken = await createRefreshToken({email: user.email, id: user._id, role: user.role});

    await Token.create({
        user: user._id,
        token: refreshToken
    })

    res.json(success({
        user,
        token,
        refreshToken
    }));
})

const login = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = AppError.create(errors.array(), 400);
        return next(error);
    }
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        const error = AppError.create("user doesn't exist", 400);
        return next(error);
    }

    const matchedPasswords = await bcrypt.compare(password, user.password);

    if(matchedPasswords)
    {
        const token = await createToken({email: user.email, id: user._id, role: user.role});
        const refreshToken = await createRefreshToken({email: user.email, id: user._id, role: user.role});

        await Token.findOneAndUpdate({user:user._id}, {token: refreshToken})

        res.json(success({token, refreshToken}))
    } else {
        const error = AppError.create("Invalid credentials", 401);
        return next(error);
    }
})

const getToken = asyncWrapper( async (req, res, next) => {

    const refreshToken = req.body.token;
    if(!refreshToken){
        return next(AppError.create("refresh token is needed", 403));
    }

    const refreshTokenDoc = await Token.findOne({token: refreshToken});
    if(!refreshTokenDoc){
        return next(AppError.create("refresh token is invalid", 403));
    }

    const {email, id, role} = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = await createToken({email, id, role});

    res.json(success({token: token}));
})

const logout = asyncWrapper( async (req, res, next) => {
    await Token.deleteOne({user: currentUser.id});

    res.json(success(null));
    
})

module.exports = {
    register, 
    login,
    getAllUsers,
    getToken,
    logout
}