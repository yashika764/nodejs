
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encryptData } = require("../utils/encrypt");
const Role = require("../models/roleModel");
const sendMail = require("../utils/nodemailer");


const createUser = async (req, res) => {
    // console.log(req.body);

    try {
        const { name, email, phone, password, role, managerId, adminId } = req.body;
        if (!name || !email || !phone || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const newEmail = email.toLowerCase()
        const userExist = await User.findOne({ email: newEmail })

        if (userExist) {
            return res.status(400).json({ success: false, message: "User already Exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email: newEmail,
            phone,
            password: hashedPassword,
            role: req.body.role,
            // createdBy: req.user._id
        })

        await newUser.save();

        // ======================user and manager find array============================
        const createdUserRole = await Role.findById(req.body.role)
        // console.log(createdUserRole);

        if (createdUserRole.name === "user") {
            const manager = await User.findById(managerId)
            // console.log(managerId);
            manager.user.push(newUser._id)
            await manager.save()

            // await User.updateOne(
            //     {
            //         _id: manager._id
            //     },
            //     {
            //         $push: {
            //             user: newUser._id
            //         }
            //     }
            // )
        }
        else if (createdUserRole.name === "manager") {
            const adminRole = await User.findById(adminId)
            adminRole.manager.push(newUser._id)
            await adminRole.save()
        }

        res.status(201).json({ success: true, message: "user created successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const loginUser = async (req, res) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "email or password required" })
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid user" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "password not match" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const encryptToken = encryptData(token)
        
        res.cookie('token', encryptToken, {
            httpOnly: true
        })

        res.status(200).json({ success: true, message: "Login successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const sendotp = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        res.status(400).json({ success: true, message: "user not found" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000
    await user.save();

    await sendMail(email, `${otp}`)

    res.status(200).json({ success: true, message: "otp sent successfully" })


}

const verifyotp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email })
    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        res.status(400).json({ success: true, message: "otp is not valid" })
    }

    user.isVerifiedOtp = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({ success: true, message: "otp verification successfull" })

}

const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "user logged out" })
}

const getAllUser = async (req, res) => {
    try {
        let { page, limit, sortBy, users, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;
        sortBy = sortBy || 'createdAt';
        users = users === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;
        const query = { isDeleted: false };
        // if (search) {
        //     query.name = { $regex: search, $options: 'i' };
        // }

        // Search Filter 
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSearch, "i");
            query.$or = [
                { name: regex },
                { email: regex },
                { phone: regex }
            ];
        }
        const user = await User.find(query).select(" -__v -updatedAt -isDeleted")
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
        const total = await User.countDocuments(query);

        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }
        res.status(200).json({
            success: true,
            totalUsers: total,
            user
        })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const userById = async (req, res) => {

    try {
        const user = await User.findById(req.params.id).populate("createdBy role user manager", "name email phone ")
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, message: "error" })
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updateuser = await User.findByIdAndUpdate(req.params.id, { name, email, phone })
        if (!updateuser) {
            return req.status(400).json({ success: false, message: "userdata not found" })
        }
        res.status(200).json({ message: "user update successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const deleteUser = async (req, res) => {
    try {
        // const deleteuser = await User.findByIdAndDelete(req.params.id);
        await User.updateOne(
            {
                _id: req.params.id

            },
            {
                isDeleted: true,
                deletedBy: req.user._id,
                deletedAt: new Date()
            }
        )
        res.status(200).json({ success: true, message: "user delete successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
}

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        await Role.create({ name });
        res.status(200).json({ success: true, message: "role added " });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error" })
    }
}

const getAllRoles = async (req, res) => {
    try {
        const role = await Role.find();
        res.status(200).json({ success: true, role })
    } catch (error) {
        return res.status(500).json({ success: false, message: "server err" })
    }
}

module.exports = { createUser, getAllUser, updateUser, deleteUser, loginUser, logoutUser, userById, createRole, getAllRoles, sendotp, verifyotp }