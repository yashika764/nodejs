const Role = require("../models/roleModel");

const isAdmin = async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)

    if (roleFind.name === "admin") {
        next();
    }
    else {
        res.status(400).json({ success: false, message: "you have no access" })
    }
}

const isManager = async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)

    if (roleFind.name === "manager") {
        next();
    }
    else {
        res.status(400).json({ success: false, message: "you have no access" })
    }
}

const isAuth = async (req, res, next) => {
    const loginUser = req.user;
    const roleFind = await Role.findById(loginUser.role)

    if (roleFind.name === "admin" || roleFind.name === "manager") {
        next();
    }
    else {
        res.status(400).json({ success: false, message: "you have no access" })
    }
}

module.exports = { isAdmin, isManager, isAuth }