const jwt = require("jsonwebtoken");

const createToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '120s'});
    return token;
}

const createRefreshToken = async (payload) => {
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    return token;
}

module.exports = {
    createToken,
    createRefreshToken
}