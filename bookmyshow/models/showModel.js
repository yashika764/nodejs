const mongoose = require("mongoose")

const showSchema = new mongoose.Schema({
    showTime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    screen: {
        type: mongoose.Schema.ObjectId,
        ref: "Screen"
    },
    seat:[{
        type:mongoose.Schema.ObjectId,
        ref:"Seat"
    }],
    theater: {
        type: mongoose.Schema.ObjectId,
        ref: "Theater"
    },
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: "Movie"
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

const Show = mongoose.model("Show", showSchema);
module.exports = Show