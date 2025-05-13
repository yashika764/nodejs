const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    category: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema)
module.exports = Category