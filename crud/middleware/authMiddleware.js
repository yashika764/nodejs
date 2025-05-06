const jwt = require("jsonwebtoken");
const { decryptData } = require("../utils/encrypt");
const User = require("../models/userModel");

const auth =async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login first" 
        })
    }
    const dedocatedToken = decryptData(token)
    try {
        const decode = jwt.verify(dedocatedToken, process.env.JWT_SECRET);
        const user=await User.findById(decode.userId)
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'token is not valid' })
    }
}

module.exports = auth;