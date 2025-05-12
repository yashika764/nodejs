const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    role: {
        type: mongoose.Schema.ObjectId,
        ref: "Role"
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User