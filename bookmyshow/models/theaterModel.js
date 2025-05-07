const mongoose = require("mongoose")

const theaterSchema = new mongoose.Schema({
    theatreName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Theater = mongoose.model("Theater", theaterSchema);
module.exports = Theater