const jwt = require("jsonwebtoken");
const { decryptData } = require("../utils/encrypt");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");

exports.auth = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        })
    }
    const dedocatedToken = decryptData(token)
    const decode = jwt.verify(dedocatedToken, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId)
    req.user = user;
    next();

})

exports.isAdmin = catchAsyncErrors(async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)
    if (roleFind.name === "admin") {
        next();
    }
    else {
        return next(new ErrorHandler("you are not admin",400))
    }
})

exports.isUser = catchAsyncErrors(async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)
    if (roleFind.name === "user") {
        next();
    }
    else {
        return next(new ErrorHandler("you are not user",400))
    }
})

exports.isAccess = catchAsyncErrors(async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)
    if (roleFind.name === "admin" || roleFind.name === "user") {
        next();
    }
    else {
        return next(new ErrorHandler("you have not access ",400))
    }
})



