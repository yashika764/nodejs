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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    place: {
        type: mongoose.Schema.ObjectId,
        ref: "Place"
    }

},{timestamps:true})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review