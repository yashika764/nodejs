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
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    maxGuest: {
        type: Number
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    bedRooms: {
        type: Number
    },
    beds: {
        type: Number
    },
    amenities: [{
        type: String
    }],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category"
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Place = mongoose.model("Place", placeSchema)
module.exports = Place