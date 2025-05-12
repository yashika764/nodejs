const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    placeImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    location: {
        type: String,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    guestLimit: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Place = mongoose.model("Place", placeSchema)
module.exports = Place