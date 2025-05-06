const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    seatsBooked: [
        {
            type: String,
            required: true
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    numberOfSeats: {
        type: Number,
    },
    show: {
        type: mongoose.Schema.ObjectId,
        ref: "Show"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }

})

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking