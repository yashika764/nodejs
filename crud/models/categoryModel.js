const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "userSchema"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "userSchema"
    },
    deletedAt: {
        type: Date
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
})

const Category = mongoose.model("Category", categorySchema)
module.exports = Category