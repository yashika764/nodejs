const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "userSchema"
    },
    deletedAt: {
        type: Date,
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "userSchema"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.ObjectId,
        ref: "Role"
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isVerifiedOtp: {
        type: Boolean,
        default:false
    },
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "userSchema"
        }
    ],
    manager: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "userSchema"
        }
    ]
}, { timestamps: true })

const User = mongoose.model("userSchema", userSchema);
module.exports = User;