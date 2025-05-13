const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    place: {
        type: mongoose.Schema.ObjectId,
        ref: "Place"
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review