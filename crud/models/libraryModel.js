const mongoose = require("mongoose")

const librarySchema = new mongoose.Schema({
    bookname: {
        type: String
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category"
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
}, { timestamps: true })

const Library = mongoose.model("Library", librarySchema)
module.exports = Library;