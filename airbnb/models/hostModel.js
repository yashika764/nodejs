const mongoose = require("mongoose")

const hostSchema = new mongoose.Schema({

    yearHosting: {
        type: Number
    },
    livesIn:{
        type:String
    },
    country:{
        type:String
    },
    place: [{
        type: mongoose.Schema.ObjectId,
        ref: "Place"
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    review: {
        type: mongoose.Schema.ObjectId,
        ref: "Review"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const Host = mongoose.model("Host", hostSchema)
module.exports = Host