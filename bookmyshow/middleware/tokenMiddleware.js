const jwt = require("jsonwebtoken");
const { decryptData } = require("../utils/encrypt");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

const auth = async (req, res, next) => {
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
        const user = await User.findById(decode.userId)
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'token is not valid' })
    }
}

const isAdmin = async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)
    if (roleFind.name === "admin") {
        next();
    }
    else {
        return res.status(404).json({ success: false, message: "you are not admin" })
    }
}

const isUser = async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)
    if (roleFind.name === "user") {
        next();
    }
    else {
        return res.status(404).json({ success: false, message: "you are not user" })
    }
}

module.exports = { auth ,isAdmin , isUser};