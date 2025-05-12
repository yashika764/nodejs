const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    guest: {
        adults: {
            type: Number
        },
        childern: {
            type: Number
        }
    },
    totalGuests: {
        type: String
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    totalNight: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    place: {
        type: mongoose.Schema.ObjectId,
        ref: "Place"
    },
}, { timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking 