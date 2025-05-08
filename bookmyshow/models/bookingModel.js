const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    seat:{
        type:mongoose.Schema.ObjectId,
        ref:'Seat'
    },
    totalPrice: {
        type: Number,
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